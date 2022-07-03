const mongoose = require('mongoose');
const { MONGODB_URI } = require('../Config');

const dbConnection = () => {

    try {
        mongoose.connect(MONGODB_URI,
            () => {
                console.log('User Db connected');
            })

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = {
    dbConnection,
    Users: require('./Models/user')
}