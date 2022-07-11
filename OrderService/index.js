const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const { dbConnection } = require('./src/Databases/index');
const { PORT } = require('./src/Config/index');
const orderApi = require('./src/Api/order-api');

const StartServer = async () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.json())

    dbConnection();
    // axios.get('http://localhost:7000/user')
    //     .then(function (response) {
    //         console.log(response)
    //     });

    app.use('/order', orderApi);

    // error handling middleware
    app.use((error, req, res, next) => {
        const status = error.statusCode || 500;
        const message = error.message;
        res.status(status).json({ message: message });
    })

    // Handles all the invalid endpoints
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Page Not Found' })
    })

    app.listen(PORT, () => {
        console.log('Server at PORT 9000');
    })
}


StartServer();