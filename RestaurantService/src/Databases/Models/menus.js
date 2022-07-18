const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menusSchema = new Schema({
    cuisine: {
        type: String,
        required: true
    },
    dishes: [
        {
            dishId:{
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            ingredients: [{
                type: String
            }],
            veg: {
                type: Boolean,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            availability: {
                type: Boolean,
                required: true
            }
        }
    ]
})

const MenuModel = mongoose.model('Menu', menusSchema);

module.exports = MenuModel;