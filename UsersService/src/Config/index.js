const dotEnv = require('dotenv');

if(process.env.NOD_ENV !== 'production'){
    dotEnv.config();
}

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    MENU_API: process.env.MENU_SERVICE,
    RESTAURANT_API: process.env.RESTAURANT_SERVICE,
    ORDER_API: process.env.ORDER_SERVICE,
    USER_TEST_DB: process.env.USER_TEST_DB
}