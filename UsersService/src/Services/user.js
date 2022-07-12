const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { SECRET } = require('../Config/index');
const { Users } = require('../Databases/index');
const Roles = require('../../../Utils/roles');
const { customError, errorHandler } = require('../ErrorHandler/index');


exports.registerUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }

        const { role, email, password, phone, address } = req.body;

        if (role === '')
            role = Roles.CUSTOMER;

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

exports.getAllUsers = async (req, res, next) => {

    try {let users;

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


        res.status(200).json({
            message: 'List of users',
            users: users,
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.updateDeliveryRating = async (req, res, next) => {
    try {
        const deliveryId = req.params.delvId;

        const deliveryPerson = await Users.findOne({ _id: deliveryId });

        if (!deliveryPerson)
            throw customError('Delivery person not exist')

        const r = req.body.rate;

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

exports.deleteUser = async (req, res, next) => {
    const uid = req.params.id;

    try {
        const user = await Users.findById(uid);

        if (!user) {
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

exports.switchRole = async (req, res, next) => {
    const uid = req.params.id;

    try {
        const user = await Users.findById(uid).select('-password');

        if (!user) {
            throw customError('User not exist', 422);
        }

        if (user.role === Roles.ADMIN)
            user.role = Roles.CUSTOMER;
        else
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
