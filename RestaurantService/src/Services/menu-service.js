const { MenuModel, RestaurantModel } = require('../Databases/index');
const uuid = require('uuid');
const { validationResult } = require('express-validator');
const { customError, errorHandler } = require('../ErrorHandler/index');

/**
 * creates new cuisine 
 * @param {Request} req incoming request object
 * @param {Response} res outgoing response object
 * @param {Function} next to make a call to next middleware
 */
exports.createCuisine = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }

        const rid = req.params.rid;

        const restaurant = await RestaurantModel.findById(rid)
            .populate('menus').exec();

        if (!restaurant) {
            throw customError('Restaurant doesn\'t exist', 422);
        }

        const check = restaurant.admins.find(elem => elem._id === req.user._id)
        // console.log(check);

        if (!check)
            throw customError('Restaurant does not have this admin', 404)

        const { cuisine } = req.body;

        const menu = new MenuModel({
            cuisine
        })

        await menu.save();

        await restaurant.save();

        res.status(200).json({
            mesaage: 'New cuisine created',
            restaurant: restaurant
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.deleteCuisine = async (req, res, next) => {
    const rid = req.params.rid;

    try {
        const restaurant = await RestaurantModel.findById(rid);

        if (!restaurant) {
            throw customError('Restaurant doesn\'t exist', 422);
        }

        const menuId = req.params.menuId;
        const menu = MenuModel.findById(menuId);

        if (!menu) {
            throw customError('Cuisine doesn\'t exist', 422);
        }

        const check = restaurant.admins.find(elem => elem._id === req.user._id)
        // console.log(check);

        if (!check)
            throw customError('Restaurant does not have this admin', 404)


        await MenuModel.deleteOne({ _id: menuId });

        restaurant.menus.filter(val => val != menu);

        restaurant.save();

        res.status(200).json({
            mesaage: 'Cuisine deleted!',
            restaurant: restaurant
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.getAllCuisinesOfRestaurant = async (req, res, next) => {
    const rid = req.params.rid;

    try {
        const restaurant = await RestaurantModel.findById(rid);

        if (!restaurant) {
            throw customError('Restaurant doesn\'t exist', 422)
        }

        const menus = restaurant.menus;

        res.status(200).json({
            mesaage: 'New User menu created',
            menus: menus
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.createDish = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }

        const rid = req.params.rid;

        const restaurant = await RestaurantModel.findById(rid)
            .populate('menus').exec();

        if (!restaurant) {
            throw customError('Restaurant doesn\'t exist', 422);
        }

        const menuId = req.params.menuId;

        const cuisine = await MenuModel.findById(menuId);
        if (!cuisine) {
            throw customError('cuisine doesn\'t exist', 422)
        }

        const check = restaurant.admins.find(elem => elem._id === req.user._id)
        // console.log(check);

        if (!check)
            throw customError('Restaurant does not have this admin', 404)


        const { name, ingredients, veg, price, availability } = req.body;

        cuisine.dishes.push({
            dishId: uuid.v4(),
            name, ingredients, veg, price, availability
        })
        await cuisine.save();
        res.status(200).json({
            mesaage: 'New dish created',
            menu: menu
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.updateDish = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const cuisine = await MenuModel.findById(menuId);

        if (!cuisine) {
            throw customError('Menu doesn\'t exist', 422);
        }

        const dId = req.params.dishId;

        const dishIndex = cuisine.dishes.findIndex(val => val.dishId == dId);
        if (dishIndex == -1) {
            throw customError('Dish doesn\'t exist', 422);
        }

        const { name, ingredients, veg, price, availability } = req.body;
        const dish = cuisine.dishes[dishIndex] = { name, ingredients, veg, price, availability }

        await cuisine.save();

        res.status(200).json({
            mesaage: 'dishe updated',
            dish: dish
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.deleteDish = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const cuisine = await MenuModel.findById(menuId);

        if (!cuisine) {
            throw customError('Menu doesn\'t exist', 422);
        }

        const dId = req.params.dishId;

        const dishes = cuisine.dishes.filter(val => val.dishId != dId);

        await cuisine.save();

        res.status(200).json({
            mesaage: 'dish deleted'
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.getDishes = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const dishes = await MenuModel.findById(menuId);

        if (!dishes) {
            throw customError('dishes doesn\'t exist', 422);
        }

        res.status(200).json({
            mesaage: 'Cuisine dishes fetched',
            dishes: dishes
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}
