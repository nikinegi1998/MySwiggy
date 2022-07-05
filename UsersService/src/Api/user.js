const express = require('express');
const { body } = require('express-validator');

const userServices = require('../Services/user');

const router = express.Router();

router.post('/register', [
    body('email', 'Please enter valid email')
        .isEmail()
        .trim(),
    body('password',
        'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body(
        'phone',
        'Please enter a valid phone number.')
        .isMobilePhone()
        .trim()
], userServices.registerUser);

router.post('/login', [
    body('email', 'Please enter a valid email id')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], userServices.loginUser);

router.delete('/:id', userServices.deleteUser);

router.patch('/role/:id', userServices.switchRole);

router.get('/admin', userServices.getAllAdmins);

router.get('/', userServices.getAllUsers);

module.exports = router;