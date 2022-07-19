const { RestaurantModel, MenuModel } = require('../Databases/index');

const { validationResult } = require('express-validator');
const axios = require('axios').default;
const { customError, errorHandler } = require('../ErrorHandler/index')
const { USER_API } = require('../Config/index');

/**
 * creates new restaurant by super admin
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.createRestaurant = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }

        const { name, location } = req.body;

        const doc = await RestaurantModel.findOne({
            $and: [{
                name: { $eq: name },
                location: { $eq: location }
            }]
        })

        if (doc) {
            throw customError('Restaurant already exist at this location', 422);
        }

        const restaurant = new RestaurantModel({
            name, location
        })

        const result = await restaurant.save();

        res.status(200).json({
            mesaage: 'New restaurant created',
            restaurant: restaurant
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * delete a restaurant by super admin
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.deleteRestaurant = async (req, res, next) => {
    const rid = req.params.rId;

    try {
        const restaurant = await RestaurantModel.findById(rid);

        if (!restaurant) {
            throw customError('Restaurant not exist', 422)
        }

        await RestaurantModel.deleteOne({ _id: rid });

        res.status(200).json({
            message: 'Restaurant deleted'
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * Delete admin from restaurant by super admin
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns 
 */
exports.deleteAdminFromRestaurant = async (req, res, next) => {

    try {
        const rId = req.params.rId;
        const restaurant = await RestaurantModel.findById(rId);
        if (!restaurant) {
            throw customError('Restaurant not exist', 422)
        }

        // fetching the bearer token from the headers
        const authHeader = req.get('Authorization')

        // calling user service to get the list of admins
        const response = await axios.get(USER_API + `?type=admin`, {
            headers: {
                Authorization: authHeader
            }
        })

        const adminId = req.params.adminId;

        // check if the admin exist
        const admin = await response.data.users.find((elem) => elem._id === adminId)
        if (!admin)
            throw customError('Admin does not exist')

        const result = restaurant.admins.find(elem => elem._id !== admin._id)

        restaurant.admins = result;
        await restaurant.save()

        res.status(200).json({
            message: 'Admin deleted',
            restaurant: restaurant
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * Give ratings to the restaurantt by customer
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.giveRatings = async (req, res, next) => {

    try {
        const rid = req.params.rId;

        const restaurant = await RestaurantModel.findOne({ _id: rid });

        if (!restaurant) {
            throw customError('No restaurant with this id exist', 422)
        }

        const r = req.body.rate;

        // fetching previous ratings and calculating the average of all and updating
        restaurant.ratings.rate = restaurant.ratings.rate * restaurant.ratings.total;
        restaurant.ratings.total += 1;
        restaurant.ratings.rate = (restaurant.ratings.rate + r) / restaurant.ratings.total;

        await restaurant.save();
        res.status(200).json({
            message: 'Ratings saved for restaurant',
            restaurant: restaurant
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * Get list of all the restaurant
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.getAllRestaurants = async (req, res, next) => {

    try {
        const currentPage = req.query.page || 1;
        const itemsPerPage = 5;
        const filter = req.query.name;

        let totalRestaurants, restaurants;

        if (!filter) {
            totalRestaurants = await RestaurantModel.find()
                .countDocuments()

            restaurants = await RestaurantModel.find()
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage);
        }
        else {
            totalRestaurants = await RestaurantModel.find({
                $or: [
                    { name: { '$regex': filter, $options: 'i' } }
                ]
            }).countDocuments()

            restaurants = await RestaurantModel.find({
                $or: [
                    { name: { '$regex': filter, $options: 'i' } }
                ]
            })
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage)
        }

        if (!restaurants) {
            throw customError('No restaurants exist', 422)
        }

        res.status(200).json({
            message: 'List of restaurants',
            restaurants: restaurants,
            totalRestaurants: totalRestaurants
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * add admin to the restaurant by super admin
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.addAdmin = async (req, res, next) => {
    try {
        const rId = req.params.rId;
        const restaurant = await RestaurantModel.findById(rId)

        if (!restaurant)
            throw customError('Restaurant not exist', 422)


        // fetching bearer token from the headers
        const authHeader = req.get('Authorization')

        // calling the user service to fetch list of admin 
        const response = await axios.get(USER_API + `/?type=admin`, {
            headers: {
                Authorization: authHeader
            }
        })

        const adminId = req.params.adminId;
        const admin = await response.data.users.find(elem => elem._id === adminId)

        if (!admin)
            throw customError('Admin does not exist')

        // check if the admin alreaady exist in restaurant
        if (restaurant.admins.find(elem => elem._id === admin._id))
            throw customError('Admin already exist', 422)

        restaurant.admins.push(admin);

        await restaurant.save()

        res.status(200).json({ message: 'Admin added', restaurant: restaurant })
    }
    catch (error) {
        next(errorHandler(error))
    }
}

/**
 * search restaurant with filters applied by the user
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.searchRestaurant = async (req, res, next) => {

    try {
        const currentPage = req.query.page || 1;
        const itemsPerPage = 5;
        const filter = req.query.filter;
        const value = req.query.value;

        let restaurants;

        switch (filter) {
            case 'location': {
                restaurants = await RestaurantModel.find
                    ({
                        $or: [
                            { location: { '$regex': value, $options: 'i' } }
                        ]
                    })
                    .skip((currentPage - 1) * itemsPerPage)
                    .limit(itemsPerPage).populate('menus').exec()
                break;
            }
            case 'cuisine': {

                const cuisines = await MenuModel.find
                    ({
                        $or: [
                            { cuisine: { '$regex': value, $options: 'i' } }
                        ]
                    })


                const result = await RestaurantModel.find();
                restaurants = []

                for (let val in cuisines) {
                    for (let i of result) {
                        for (let j of i.menus) {
                            if (JSON.stringify(j) === JSON.stringify(cuisines[val]._id)) {
                                restaurants.push(i);
                                break;
                            }
                        }
                    }
                }

                break;
            }
            case 'dish': {

                const allCuisines = await MenuModel.where('dishes.name', value);

                console.log(allCuisines)
                // let cuisines = [];
                // for (let i of allCuisines) {
                //     if (i.dishes.find(elem => elem.name.toLowerCase().includes(value.toLowerCase())))
                //         cuisines.push(i)
                // }

                // const restResult = await RestaurantModel.find();
                // restaurants = []

                // for (let val in cuisines) {
                //     for (let i of restResult) {
                //         for (let j of i.menus) {
                //             if (JSON.stringify(j) === JSON.stringify(cuisines[val]._id)) {
                //                 restaurants.push(i);
                //                 break;
                //             }
                //         }
                //     }
                // }

                break;
            }
            default: {
                throw customError('Filter applied is not available', 404)
            }
        }

        if (!restaurants)
            customError('No results found')

        res.status(200).json({
            message: 'Ratings saved for restaurant',
            restaurants: restaurants
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}
