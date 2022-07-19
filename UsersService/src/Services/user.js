// installed packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// imported files
const { SECRET } = require('../Config/index');
const { Users } = require('../Databases/index');
const Roles = require('../../../Utils/roles');
const { customError, errorHandler } = require('../ErrorHandler/index');

/**
 * created new user in the database
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns new user created
 */
exports.registerUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }

        const { role, email, password, phone, address } = req.body;

        if ((role !== Roles.ADMIN) && (role !== Roles.CUSTOMER) &&
            (role !== Roles.SUPERADMIN) && (role !== Roles.DELIVERY)) {

            throw customError('Role can\'t be identified', 422)
        }

        const doc = await Users.findOne({ email: email })

        if (doc) {
            throw customError('User already exist', 422)
        }

        const hashedPass = await bcrypt.hash(password, 12);

        const user = new Users({
            role, email, password: hashedPass, phone, address
        })

        await user.save();
        res.status(200).json({
            mesaage: 'New User created',
            user: user
        })
    }
    catch (error) {
        next(errorHandler(error));
        return error;
    }

}

/**
 * user login method 
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns token, email and role of the user
 */
exports.loginUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }

        const { email, password } = req.body;

        const user = await Users.findOne({ email: email });

        if (!user) {
            throw customError('Email id doesn\'t exist', 422)
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            throw customError('Incorrect password', 422);
        }

        const token = jwt.sign({
            email: email,
            role: user.role
        }, SECRET, { expiresIn: '4h' })

        res.status(200).json({
            message: 'Logged In successfully',
            token: token,
            email: user.email,
            role: user.role
        })

    }
    catch (error) {
        next(errorHandler(error));
        return error;
    }
}

/**
 * fetches all the user or only the admins 
 * if query parameter is passed 
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.getAllUsers = async (req, res, next) => {

    try {
        let users;
        const filter = req.query.type;

        if (filter === Roles.ADMIN) {
            users = await Users.find({ role: Roles.ADMIN })
                .select('-password').select('-ratings').select('-role')
        }
        else {
            users = await Users.find().select('-password').select('-ratings')
        }

        if (!users) {
            throw customError('No users exist', 422);
        }

        const total = users.length;

        res.status(200).json({
            message: 'List of users',
            users: users,
            total: total
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * updating rating of delivery person by the customer
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.updateDeliveryRating = async (req, res, next) => {
    try {
        const deliveryId = req.params.delvId;

        const deliveryPerson = await Users.findOne({ _id: deliveryId });

        if (!deliveryPerson || deliveryPerson.role !== Roles.DELIVERY)
            throw customError('Delivery person not exist', 422)

        const r = req.body.rate;

        // fetching previous value and calculating average to update the ratings
        deliveryPerson.ratings.rate *= deliveryPerson.ratings.total;
        deliveryPerson.ratings.total += 1;
        deliveryPerson.ratings.rate = (deliveryPerson.ratings.rate + r) / deliveryPerson.ratings.total;

        await deliveryPerson.save();

        res.status(200).json({
            mesaage: 'Delivery person\'s ratings updated',
            deliveryDetails: deliveryPerson
        })
    }
    catch (error) {
        errorHandler(error);
    }
}

/**
 * remove or cancel order from customer profile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.removeOrder = async (req, res, next) => {
    try {
        const order = req.body.order;

        const customer = await Users.findOne({ email: order.customerDetails.email })
        if (!customer)
            throw customError('customer doesn\'t exist')

        const check = customer.orders.find(elem => elem._id === order._id)
        if (!check)
            throw customError('You haven\'t ordered this')


        const result = customer.orders.find(elem => elem._id !== order._id)
        customer.orders = result;

        res.status(200).json({
            message: "Successfuly deleted",
            customer: customer
        })

    }
    catch (error) {
        next(errorHandler(error))
    }
}

/**
 * adds order details to customer data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.addOrder = async (req, res, next) => {
    try {
        const { result } = req.body;


        const user = await Users.findOne({ email: result.customerDetails.email })

        if (!user)
            throw customError('User not exist', 404)

        delete result["customerDetails"];

        user.orders.push(result)
        await user.save()

        res.status(200).json({
            message: 'Order added to customer profile',
            user: user
        })
    }
    catch (error) {
        next(errorHandler(error))
    }
}

/**
 * delete a user by super admin
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.deleteUser = async (req, res, next) => {
    const uid = req.params.id;

    try {
        const user = await Users.findById(uid);

        if (!user || user.role !== Roles.DELIVERY) {
            throw customError('User not exist', 422);
        }

        await user.deleteOne({ _id: uid });

        res.status(200).json({
            message: 'User deleted'
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * switch role of a customer to admin and vice-versa by super admin
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.switchRole = async (req, res, next) => {
    const uid = req.params.id;

    try {
        const user = await Users.findById(uid).select('-password');

        if (!user) {
            throw customError('User not exist', 422);
        }

        if (user.role === Roles.ADMIN)
            user.role = Roles.CUSTOMER;
        else if (user.role === Roles.CUSTOMER)
            user.role = Roles.ADMIN;

        await user.save();
        res.status(200).json({
            message: 'Role updated',
            user: user
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}
