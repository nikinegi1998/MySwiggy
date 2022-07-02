const express = require('express');
const { body } = require('express-validator');

const userServices = require('../Services/user');

const router = express.Router();

router.post('/register', userServices.registerUser)


module.exports = router;