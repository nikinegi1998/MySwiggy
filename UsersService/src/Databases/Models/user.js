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
    // properties:{
    //     orders: {
    //         type: String
    //         // type: Schema.Types.ObjectId
    //         // ref: 'Order'
    //     },
    //     ratings: {
    //         type: Number
    //     }
    // admin id include here========================
    // }
    orders: {
        type: String
        // type: Schema.Types.ObjectId
        // ref: 'Order'
    },
    ratings: {
        rate: {
            type: Number,
            min: 1,
            max: 5,
            default: 1
        },
        total: {
            type: Number,
            default: 1
        }
    }
    
})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;