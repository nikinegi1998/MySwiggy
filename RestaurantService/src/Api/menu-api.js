const express = require('express');
const { body } = require('express-validator');

const menuServices = require('../Services/menu-service');
const { isAuth, isAuthorized } = require('./middlewares/index');
const Roles = require('../../../Utils/roles');

const router = express.Router();

// ----------------- CUISINES----------------------------
// get all cuisines of all the restaurant
router.get('/cuisine', isAuth, menuServices.getCuisines)

// create new cuisine
router.post('/create/:rid/menu', [
    body('cuisine', 'Enter a valid name for a cuisine')
        .isLength({ min: 5 })
        .isString()
], isAuth, isAuthorized(Roles.ADMIN), menuServices.createCuisine);

// delete a cuisine from restaurant 
router.delete('/delete/:rid/:menuId',isAuth, isAuthorized(Roles.ADMIN),  menuServices.deleteCuisine);

// get all the cuisines of a restaurant
router.get('/:rid', isAuth, menuServices.getAllCuisinesOfRestaurant);

// --------------------- DISHES ----------------------------

// create dish in a cuisine
router.post('/create/:rid/:menuId', [
    body('name', 'Enter a valid dish name with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('ingredients', 'Enter a valid ingredients with min length of 4')
        .isArray(),
    body('veg', 'Enter category(veg/ non veg)')
        .isBoolean(),
    body('price', 'Enter a valid price')
        .isNumeric(),
    body('availability', 'Enter amount of dish available')
        .isNumeric()
], isAuth, isAuthorized(Roles.ADMIN), menuServices.createDish)

// update dish in a cuisine
router.post('/:menuId/:dishId', isAuth, isAuthorized(Roles.ADMIN), menuServices.updateDish);

// delete dish in a cuisine
router.delete('/:menuId/dish/:dId', isAuth, isAuthorized(Roles.ADMIN), menuServices.deleteDish);

// get all dishes of a cuisine
router.get('/cuisine/:menuId', isAuth, menuServices.getDishes);


module.exports = router;



// short forms:-
// rid = restaurant id
// menuId = cuisines id
// dishId = dish id