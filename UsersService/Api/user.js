const express = require('express');
const { body } = require('express-validator');

const userServices = require('../Services/user');

const router = express.Router();

router.post('/register', userServices.registerUser);

router.post('/login', userServices.loginUser);

router.delete('/:id', userServices.deleteUser);

router.patch('/role/:id', userServices.switchRole);

router.get('/admin', userServices.getAllAdmins);

router.get('/', userServices.getAllUsers);

module.exports = router;