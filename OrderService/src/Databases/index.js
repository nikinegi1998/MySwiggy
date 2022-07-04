
const mongoose = require('mongoose');

const { DB_URL } = require('../Config/index');

dbConnection = () => {
    try {
        mongoose.connect(DB_URL, () => {
            console.log('OrdersDB connected');
        })
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = {
    dbConnection,
    Orders: require('./Models/order')
}