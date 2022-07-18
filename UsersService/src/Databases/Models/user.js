const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema design for the users
 */
const userSchema = new Schema({
    role: {
        type: String,
        required: true,
        default: 'customer'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String
        }
    },
    orders: [{
        type: Object
    }],
    // delivery person's rating only
    ratings: {
        rate: {
            type: Number,
            max: 5,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    }

})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;