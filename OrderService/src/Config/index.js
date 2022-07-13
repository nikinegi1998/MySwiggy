const dotenv = require('dotenv');

if (process.env.NOD_ENV !== 'production') {
    dotenv.config();
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    TEST_ORDER_DB: process.env.TEST_ORDER_DB,
    SECRET: process.env.SECRET,
    MENU_API: process.env.MENU_SERVICE,
    RESTAURANT_API: process.env.RESTAURANT_SERVICE,
    USER_API: process.env.USER_SERVICE
}