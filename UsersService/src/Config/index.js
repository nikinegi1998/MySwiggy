const dotEnv = require('dotenv');

if(process.env.NOD_ENV !== 'production'){
    dotEnv.config();
}

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET
}