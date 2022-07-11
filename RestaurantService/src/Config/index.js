const dotenv = require('dotenv');

if (process.env.NOD_ENV !== 'production') {
    dotenv.config();
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    ORDER_API: process.env.ORDER_SERVICE,
    USER_API: process.env.USER_SERVICE
}