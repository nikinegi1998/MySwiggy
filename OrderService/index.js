const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {dbConnection} = require('./Databases/index');
const { PORT } = require('./Config/index');
const restaurantApi = require('./Api/user');

const StartServer = async () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.json())

    dbConnection();

    app.use('/user', restaurantApi);

    // error handling middleware
    app.use((error, req, res, next) => {
        const status = error.statusCode || 500;
        const message = error.message;
        res.status(status).json({ message: message });
    })

    // Handles all the invalid endpoints
    app.use((req, res, next)=>{
        res.status(404).json({message: 'Page Not Found'})
    })

    app.listen(PORT, () => {
        console.log('Server at PORT 8000');
    })
}


StartServer();