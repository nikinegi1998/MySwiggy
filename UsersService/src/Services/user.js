const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { SECRET } = require('../Config/index');
const { Users } = require('../Databases/index');
const Roles = require('../Utils/roles');

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
        }, SECRET, { expiresIn: '2h' })

        res.status(200).json({
            message: 'Logged In successfully',
            token: token,
            email: user.email,
            role: user.role
        })

    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.getAllUsers = async (req, res, next) => {

    try {
        const users = await Users.find();

        if (!users) {
            throw customError('No users exist', 422);
        }
        res.status(200).json({
            message: 'List of users',
            users: users
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.getAllAdmins = async (req, res, next) => {
    try {
        const users = await Users.find({ role: Roles.ADMIN });

        if (!users) {
            throw customError('No users exist', 422);
        }
        res.status(200).json({
            message: 'List of Restaurant\'s Admin',
            users: users
        })
    }
    catch (error) {
        next(errorHandler(error));
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
        const user = await Users.findById(uid);

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