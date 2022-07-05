const express = require('express');
const { body } = require('express-validator');

const menuServices = require('../Services/menu-service');

const router = express.Router();

// ----------------- CUISINES----------------------------
// create new cuisine
router.post('/create/:rid/menu', [
    body('cuisine', 'Enter a valid name for a cuisine')
        .isLength({ min: 5 })
        .isString(),
    body('name', 'Enter a valid dish name with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('ingredients', 'Enter a valid ingredients with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('veg', 'Enter category(veg/ non veg)')
        .isBoolean(),
    body('price', 'Enter a valid price')
        .isNumeric(),
    body('availability', 'Enter amount of dish available')
        .isNumeric()
], menuServices.createCuisine);

// delete a cuisine from restaurant 
router.delete('/delete/:rid/:menuId', menuServices.deleteCuisine);

// get all the cuisines of a restaurant
router.get('/:rid', menuServices.getAllCuisinesOfRestaurant);

// --------------------- DISHES ----------------------------

// create dish in a cuisine
router.post('/create/:menuId', [
    body('name', 'Enter a valid dish name with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('ingredients', 'Enter a valid ingredients with min length of 4')
        .isString()
        .isLength({ min: 4 }),
    body('veg', 'Enter category(veg/ non veg)')
        .isBoolean(),
    body('price', 'Enter a valid price')
        .isNumeric(),
    body('availability', 'Enter amount of dish available')
        .isNumeric()
], menuServices.createDish)

// update dish in a cuisine
router.post('/:menuId/:dishId', menuServices.updateDish);

// delete dish in a cuisine
router.delete('/:menuId/dish/:dId', menuServices.deleteDish);

// get all dishes of a cuisine
router.patch('/cuisine/:menuId', menuServices.getDishes);

module.exports = router;



// short forms:-
// rid = restaurant id
// menuId = cuisines id
// dishId = dish id