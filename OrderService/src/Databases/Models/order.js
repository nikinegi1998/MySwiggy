const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    dishes: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalprice: {
        type: Number,
        required: true
    },
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    orderStatus:{
        type: Boolean,          // either reject or accept
        required: true
    },
    deliveryPartner:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    deliveryStatus:{
        type: String,           // otw or reached or pickup or delivered
        required: true
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
    },

})

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;