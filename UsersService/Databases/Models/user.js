const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    orders: {
        type: String
        // type: Schema.Types.ObjectId
        // ref: 'Order'
    },
    ratings: {
        type: Number
    }
})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;