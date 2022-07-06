const { RestaurantModel } = require('../Databases/index');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const axios = require('axios').default;


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

        await restaurant.save();

        res.status(200).json({
            mesaage: 'New restaurant created',
            restaurant: restaurant
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.deleteRestaurant = async (req, res, next) => {
    const rid = req.params.id;

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

exports.getAllRestaurants = async (req, res, next) => {

    try {
        const restaurants = await RestaurantModel.find();

        if (!restaurants) {
            throw customError('No restaurants exist', 422)
        }
        res.status(200).json({
            message: 'List of restaurants',
            restaurants: restaurants
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.getRestaurantsByName = async (req, res, next) => {
    const name = req.params.name;

    try {
        const restaurants = await RestaurantModel.find({ name: name });

        if (!restaurants) {
            throw customError('No restaurants exist', 422)
        }
        res.status(200).json({
            message: 'List of restaurants',
            restaurants: restaurants
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.giveRatings = async (req, res, next) => {
    const rid = req.params.id;

    try {
        const restaurant = await RestaurantModel.findOne({ _id: rid });

        if (!restaurant) {
            throw customError('No restaurant with this id exist', 422)
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
        next(errorHandler(error));
    }
}

exports.getAuth = async (req, res, next) => {
    console.log('rest')
    const response = await axios.get('http://localhost:7000/user/login')


    console.log(response.data);
    res.status(200).json({
        message: 'fetched',
        response: response.data
    })
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
        next(errorHandler(error));
    }
}

const customError = (msg, code) => {
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}

const errorHandler = (error) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    return error;
}