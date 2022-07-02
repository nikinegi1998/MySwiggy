const bcrypt = require('bcryptjs');

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