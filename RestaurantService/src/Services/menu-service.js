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

        const check = restaurant.admins.find(elem => elem.email === req.user.email)

        if (!check)
            throw customError('Restaurant does not have this admin', 404)

        const { cuisine } = req.body;

        const menu = new MenuModel({
            cuisine
        })

        await menu.save();

        restaurant.menus.push(menu);
        await restaurant.save()

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
        const menu = await MenuModel.findById(menuId);

        if (!menu) {
            throw customError('Cuisine doesn\'t exist', 422);
        }

        const check = restaurant.admins.find(elem => elem.email === req.user.email)

        if (!check)
            throw customError('Restaurant does not have this admin', 404)


        await MenuModel.deleteOne({ _id: menuId });

        const result = restaurant.menus.filter(val =>
            JSON.stringify(val) !== JSON.stringify(menu._id));

        restaurant.menus = result;
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

    try {
        const rid = req.params.rid;
        const currentPage = req.query.page || 1;
        const itemsPerPage = 5;

        const restaurant = await RestaurantModel.findById(rid)
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage).populate('menus');

        if (!restaurant) {
            throw customError('Restaurant doesn\'t exist', 422)
        }

        const menus = restaurant.menus

        res.status(200).json({
            mesaage: 'New User menu created',
            menus: menus,
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

        const check = restaurant.admins.find(elem => elem.email === req.user.email)

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
            cuisine: cuisine
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.updateDish = async (req, res, next) => {

    try {
        const menuId = req.params.menuId;
        const cuisine = await MenuModel.findById(menuId);

        if (!cuisine) {
            throw customError('Menu doesn\'t exist', 422);
        }

        const dId = req.params.dishId;

        let dishIndex = cuisine.dishes.findIndex(val => val.dishId === dId);


        if (dishIndex == -1) {
            throw customError('Dish doesn\'t exist', 422);
        }

        const { name, ingredients, veg, price, availability } = req.body;

        cuisine.dishes[dishIndex].name = name
        cuisine.dishes[dishIndex].ingredients = ingredients
        cuisine.dishes[dishIndex].veg = veg
        cuisine.dishes[dishIndex].price = price
        cuisine.dishes[dishIndex].availability = availability

        await cuisine.save();

        res.status(200).json({
            mesaage: 'dish updated',
            dish: cuisine.dishes
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

        const dId = req.params.dId;

        const check = cuisine.dishes.find(val => val.dishId === dId);

        if (!check)
            throw customError('Dish not available', 422)

        const dishes = cuisine.dishes.filter(val => val.dishId !== dId);

        cuisine.dishes = dishes
        await cuisine.save();

        res.status(200).json({
            mesaage: 'dish deleted',
            cuisine: cuisine
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.getDishes = async (req, res, next) => {

    try {
        const menuId = req.params.menuId;
        const currentPage = req.query.page || 1;
        const itemsPerPage = 5;

        const cuisine = await MenuModel.findById(menuId)
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        if (!cuisine) {
            throw customError('cuisine doesn\'t exist', 422);
        }

        const dishes = cuisine.dishes

        res.status(200).json({
            mesaage: 'Cuisine dishes fetched',
            dishes: dishes
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.getCuisines = async (req, res, next) => {
    try {
        const cuisine = await MenuModel.find()

        if (!cuisine)
            throw customError('No cuisines available ', 422)

        res.status(200).json({
            message: 'All cuisines in db',
            cuisine: cuisine
        })
    }
    catch (error) {
        next(errorHandler(error))
    }
}