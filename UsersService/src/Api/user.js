const express = require('express');
const { body } = require('express-validator');

const userServices = require('../Services/user');
const isAuth = require('../Api/middlewares/is-auth');

const router = express.Router();

// create new user (super admin/ admin/ customer/ delivery)
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

// login existing user (super admin/ admin/ customer/ delivery)
router.post('/login', [
    body('email', 'Please enter a valid email id')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], userServices.loginUser);

// delete a user by super admin
router.delete('/:id', userServices.deleteUser);

// switch role (admin/ customer) by super admin
router.patch('/role/:id', userServices.switchRole);

// Give ratings to delivery person
router.patch('/delivery/:delvId',  userServices.updateDeliveryRating )

// get all users or filter gett request with query params
router.get('/', isAuth, userServices.getAllUsers);

module.exports = router;