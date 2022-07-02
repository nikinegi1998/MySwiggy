const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET } = require('../Config/index');
const { Users } = require('../Databases/index');
const Roles = require('../Utils/roles');

exports.registerUser = async (req, res, next) => {
    const { role, email, password, phone, address } = req.body;

    if (role === '')
        role = Roles.CUSTOMER;

    if ((role !== Roles.ADMIN) && (role !== Roles.CUSTOMER) &&
        (role !== Roles.SUPERADMIN) && (role !== Roles.DELIVERY)) {

        const error = new Error('Role can\'t be identified');
        error.statusCode = 422;
        next(error);
    }

    try {
        const doc = await Users.findOne({ email: email })

        if (doc) {
            const error = new Error('User already exist');
            error.statusCode = 422;
            throw error;
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email });

        if (!user) {
            const error = new Error('Email id doesn\'t exist');
            error.statusCode = 422;
            throw error;
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            const error = new Error('Incorrect password');
            error.statusCode = 422;
            throw error;
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAllUsers = async (req, res, next) => {

    try {
        const users = await Users.find();

        if (!users) {
            const error = new Error('No users exist');
            error.statusCode = 422;
            next(error);
        }
        res.status(200).json({
            message: 'List of users',
            users: users
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAllAdmins = async (req, res, next) => {
    try {
        const users = await Users.find({ role: Roles.ADMIN });

        if (!users) {
            const error = new Error('No users exist');
            error.statusCode = 422;
            next(error);
        }
        res.status(200).json({
            message: 'List of Restaurant\'s Admin',
            users: users
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    const uid = req.params.id;

    try {
        const user = await Users.findById(uid);

        if (!user) {
            const error = new Error('User not exist');
            error.statusCode = 422;
            next(err);
        }

        await user.deleteOne({ _id: uid });

        res.status(200).json({
            message: 'User deleted'
        })
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.switchRole = async (req, res, next) => {
    const uid = req.params.id;

    try{
        const user = await Users.findById(uid);

        if (!user) {
            const error = new Error('User not exist');
            error.statusCode = 422;
            next(err);
        }

        if(user.role === Roles.ADMIN)
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}