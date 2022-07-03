const { MenuModel, RestaurantModel } = require('../Databases/index');
const uuid = require('uuid');

exports.createCuisine = async (req, res, next) => {
    const rid = req.params.rid;

    try {
        const restaurant = await RestaurantModel.findById(rid)
            .populate('menus').exec();

        if (!restaurant) {
            const error = new Error('Restaurant doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        const { cuisine, name, ingredients, veg, price, availability } = req.body;

        const menu = new MenuModel({
            cuisine,
            dishes: {
                dishId: uuid.v4(),
                name, ingredients, veg, price, availability
            }
        })

        await menu.save();

        restaurant.menus.push(menu);
        await restaurant.save();

        res.status(200).json({
            mesaage: 'New menu created',
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

exports.deleteCuisine = async (req, res, next) => {
    const rid = req.params.rid;

    try {
        const restaurant = await RestaurantModel.findById(rid);

        if (!restaurant) {
            const error = new Error('Restaurant doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        const menuId = req.params.menuId;
        const menu = MenuModel.findById(menuId);

        if (!menu) {
            const error = new Error('Menu doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        await MenuModel.deleteOne({ _id: menuId });

        restaurant.menus.filter(val => val != menu);

        restaurant.save();

        res.status(200).json({
            mesaage: 'Menu deleted!',
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

exports.getAllCuisinesOfRestaurant = async (req, res, next) => {
    const rid = req.params.rid;

    try {
        const restaurant = await RestaurantModel.findById(rid);

        if (!restaurant) {
            const error = new Error('Restaurant doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        const menus = restaurant.menus;

        res.status(200).json({
            mesaage: 'New User menu created',
            menus: menus
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.createDish = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const cuisine = await MenuModel.findById(menuId);
        if (!cuisine) {
            const error = new Error('cuisine doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updateDish = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const cuisine = await MenuModel.findById(menuId);

        if (!cuisine) {
            const error = new Error('Menu doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        const dId = req.params.dishId;

        const dishIndex = cuisine.dishes.findIndex(val => val.dishId == dId);
        if(dishIndex == -1){
            const error = new Error('Dish doesn\'t exist');
            error.statusCode = 422;
            throw error;
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.deleteDish = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const cuisine = await MenuModel.findById(menuId);

        if (!cuisine) {
            const error = new Error('Menu doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        const dId = req.params.dishId;

        const dishes = cuisine.dishes.filter(val => val.dishId != dId);
        
        await cuisine.save();

        res.status(200).json({
            mesaage: 'dish deleted'
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getDishes = async (req, res, next) => {
    const menuId = req.params.menuId;

    try {
        const dishes = await MenuModel.findById(menuId);

        if (!dishes) {
            const error = new Error('dishes doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        res.status(200).json({
            mesaage: 'Cuisine dishes fetched',
            dishes: dishes
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}
