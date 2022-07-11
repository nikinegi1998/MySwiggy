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
    customerDetails:{
        type: Object,
        required: true
    },
    orderStatus:{
        type: Boolean,          // either reject or accept
        required: true
    },
    deliveryPartner:{
        type: Object
    },
    deliveryStatus:{
        type: String,           // otw or reached or pickup or delivered
    }
})

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;