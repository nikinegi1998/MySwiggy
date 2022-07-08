const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    ratings: {
        rate: {
            type: Number,
            min: 1,
            max: 5,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },
    admins: [{
        type: Object
    }],
    menus: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    }]
})

const RestaurantModel = mongoose.model('Restaurants', restaurantSchema);

module.exports = RestaurantModel;