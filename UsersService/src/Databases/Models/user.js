const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: {
        type: String,
        required: true
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
    // order details from customer
    orders: {
        type: Schema.Types.ObjectId
    },
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