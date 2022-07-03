const express = require('express');
const { PORT } = require('./config');
const { dbConnection } = require('./database/index');
const cors = require('cors');

const StartServer = async () => {


    const app = express();

    await dbConnection();
    app.use(express.json());
    app.use(cors());

    app.use((error, req, res, next) => {
        const status = error.statusCode || 500;
        const message = error.message;
        res.status(status).json({ message: message });
    });

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })
}

StartServer();