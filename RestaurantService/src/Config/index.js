const dotenv = require('dotenv');

if (process.env.NOD_ENV !== 'production') {
    dotenv.config();
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    SECRET: process.env.SECRET
}