const express = require('express');
const { body } = require('express-validator');

const restrServices = require('../Services/restaurant-service');
const isAuth = require('../Api/middlewares/is-auth');

const router = express.Router();

// create new restaurant
router.post('/create', [
    body('name', 'Enter a valid restaurant name with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('location', 'Enter a valid location with min length of 4')
        .isString()
        .isLength({ min: 4 }),
], restrServices.createRestaurant);

// get restaurant by name
router.get('/list/:name', restrServices.getRestaurantsByName);

// delete restaurant
router.delete('/:id', restrServices.deleteRestaurant);

//  give ratings for restaurant
router.patch('/rate/:id', restrServices.giveRatings);

// search for restaurant with filter (location, cuisine, dish, ingredients)
router.get('/search/:filter/:name', restrServices.searchRestaurant);

router.get('/authen', restrServices.getAuth);

// get all restaurants
router.get('/', isAuth, restrServices.getAllRestaurants);

module.exports = router;