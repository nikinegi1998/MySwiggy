const express = require('express');
const { body } = require('express-validator');

const restrServices = require('../Services/restaurant-service');
const {isAuth, isAuthorized} = require('../Api/middlewares/index');
const Roles = require('../../../Utils/roles');

const router = express.Router();

// adds a new admin to restaurant
router.patch('/create/:rId/:adminId', isAuth, isAuthorized(Roles.SUPERADMIN), restrServices.addAdmin)

// create new restaurant
router.post('/create', isAuth, isAuthorized(Roles.SUPERADMIN), [
    body('name', 'Enter a valid restaurant name with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('location', 'Enter a valid location with min length of 4')
        .isString()
        .isLength({ min: 4 }),
], restrServices.createRestaurant);

// delete admin from restaurant
router.delete('/:rId/:adminId', isAuth, isAuthorized(Roles.SUPERADMIN), restrServices.deleteAdminFromRestaurant)

// delete restaurant
router.delete('/:rId', isAuth, isAuthorized(Roles.SUPERADMIN), restrServices.deleteRestaurant);

//  give ratings for restaurant
router.patch('/rate/:rId', isAuth, isAuthorized(Roles.CUSTOMER), restrServices.giveRatings);

// search for restaurant with filter (location, cuisine, dish, ingredients)
// ? filter & value
router.get('/search/', restrServices.searchRestaurant);

// get all restaurants or get restaurant by name using query parameter
router.get('/', restrServices.getAllRestaurants);

module.exports = router;



// Shortcuts:----------------
// rId : Restaurant id
// adminId: Admin id