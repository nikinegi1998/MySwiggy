const { validationResult } = require('express-validator');
const axios = require('axios').default;
const NodeCache = require('node-cache')

const { RestaurantModel, MenuModel } = require('../Databases/index');
const { customError, errorHandler } = require('../ErrorHandler/index')
const { USER_API } = require('../Config/index');

const myCache = new NodeCache({ stdTTL: 10 });

const itemsPerPage = 10;

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
            restaurant: result
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

        const deletedRestaurant = restaurant
        await RestaurantModel.deleteOne({ _id: rid });

        res.status(200).json({
            message: 'Restaurant deleted',
            deletedRestaurant: deletedRestaurant
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
        
        const adminId = req.params.adminId;

        // calling user service to get the list of admins
        const response = await axios.get(USER_API + `/check/${adminId}/?role=admin`, {
            headers: {
                Authorization: authHeader
            }
        })

        // check if the admin exist
        if (!response.data.value)
            throw customError('Not an admin')

        const admin = response.data.user;

        const result = restaurant.admins.find(elem => elem._id === admin._id)
        if(!result)
            throw customError('This admin does not exist in the restaurant', 422)

        restaurant.admins = restaurant.admins.find(elem => elem._id !== admin._id);
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

        const totalRestaurants = await RestaurantModel.find().countDocuments()

        const restaurants = await RestaurantModel.find()
            .skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)

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

        const adminId = req.params.adminId;

        // calling the user service to fetch list of admin 
        const response = await axios.get(USER_API + `/check/${adminId}/?role=admin`, {
            headers: {
                Authorization: authHeader
            }
        })

        if (!response.data.value)
            throw customError('Not an admin')

        const admin = response.data.user;

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
        const filter = req.query.filter;
        const value = req.query.value;
        if (!value)
            throw customError('Enter a valid value', 422)

        const currentPage = req.query.page || 1;

        let restaurants, total;

        if (myCache.has(value)) {
            console.log('From Cache search')
            restaurants = myCache.get(value);
        }
        else {
            console.log('From API search')
            switch (filter) {
                case 'name':
                case 'location': {
                    total = await RestaurantModel.find({
                        $or: [
                            { name: { '$regex': value, $options: 'i' } },
                            { location: { '$regex': value, $options: 'i' } }
                        ]
                    }).countDocuments();

                    restaurants = await RestaurantModel.find
                        ({
                            $or: [
                                { name: { '$regex': value, $options: 'i' } },
                                { location: { '$regex': value, $options: 'i' } }
                            ]
                        }).skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)
                        .select('-admins').populate('menus').exec()

                    if (restaurants)
                        myCache.set(value, restaurants)

                    break;
                }
                case 'cuisine': {

                    const cuisines = await MenuModel.find
                        ({
                            $or: [
                                { cuisine: { '$regex': value, $options: 'i' } }
                            ]
                        }).skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)


                    const resResult = await RestaurantModel.find()
                        .select('-admins').populate('menus').exec();

                    restaurants = new Array()
                    for (let val of cuisines) {
                        for (let elem of resResult) {
                            if (elem.menus.find(i => JSON.stringify(i._id) === JSON.stringify(val._id))) {
                                restaurants.push(elem);
                                break;
                            }
                        }
                    }
                    total = restaurants.length;
                    break;
                }
                case 'dish': {

                    const allCuisines = await MenuModel.find({
                        "dishes.name": value
                    }).skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)

                    const restResult = await RestaurantModel.find()
                        .select('-admins').populate('menus').exec();

                    restaurants = []

                    for (let val of allCuisines) {
                        for (let elem of restResult) {
                            if (elem.menus.find(i => JSON.stringify(i._id) === JSON.stringify(val._id)))
                                restaurants.push(elem)
                        }
                    }
                    total = restaurants.length;

                    break;
                }
                default: {
                    throw customError('Filter applied is not available', 404)
                }
            }
        }

        res.status(200).json({
            message: 'List of restaurant',
            restaurants: restaurants,
            totalRestaurants: total
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}
