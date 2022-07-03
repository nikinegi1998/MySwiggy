const { RestaurantModel } = require('../Databases/index');
const mongoose = require('mongoose');

exports.createRestaurant = async (req, res, next) => {
    const { name, location } = req.body;

    try {
        const doc = await RestaurantModel.findOne({
            $and: [
                {
                    name: { $eq: name },
                    location: { $eq: location }
                }
            ]
        })

        if (doc) {
            const error = new Error('Restaurant already exist at this location');
            error.statusCode = 422;
            throw error;
        }

        const restaurant = new RestaurantModel({
            name, location
        })

        await restaurant.save();

        res.status(200).json({
            mesaage: 'New restaurant created',
            restaurant: restaurant
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.deleteRestaurant = async (req, res, next) => {
    const rid = req.params.id;

    try {
        const restaurant = await RestaurantModel.findById(rid);

        if (!restaurant) {
            const error = new Error('Restaurant not exist');
            error.statusCode = 422;
            next(err);
        }

        await RestaurantModel.deleteOne({ _id: rid });

        res.status(200).json({
            message: 'Restaurant deleted'
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAllRestaurants = async (req, res, next) => {

    try {
        const restaurants = await RestaurantModel.find();

        if (!restaurants) {
            const error = new Error('No restaurants exist');
            error.statusCode = 422;
            next(error);
        }
        res.status(200).json({
            message: 'List of restaurants',
            restaurants: restaurants
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getRestaurantsByName = async (req, res, next) => {
    const name = req.params.name;

    try {
        const restaurants = await RestaurantModel.find({ name: name });

        if (!restaurants) {
            const error = new Error('No restaurants exist');
            error.statusCode = 422;
            next(error);
        }
        res.status(200).json({
            message: 'List of restaurants',
            restaurants: restaurants
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.giveRatings = async (req, res, next) => {
    const rid = req.params.id;

    try {
        const restaurant = await RestaurantModel.findOne({ _id: rid });

        if (!restaurant) {
            const error = new Error('No restaurant with this id exist');
            error.statusCode = 422;
            next(error);
        }

        const r = req.body.rate;

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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// ============ implement this =======================
exports.searchRestaurant = async (req, res, next) => {
    const filter = req.params.filter;

    try {

        switch (filter) {
            case 'location': {
                break;
            }
            case 'cuisine': {
                break;
            }
            case 'dish': {
                break;
            }
            case 'ingredients': {
                break;
            }
        }
        res.status(200).json({
            message: 'Ratings saved for restaurant'
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}