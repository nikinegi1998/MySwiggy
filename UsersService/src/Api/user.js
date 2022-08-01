// installed packages
const express = require('express');
const { body } = require('express-validator');

// imported files/ folder
const userServices = require('../Services/user');
const { isAuth, isAuthorized } = require('../Api/middlewares/index');
const Role = require('../../../Utils/roles');

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
router.delete('/:id', isAuth, isAuthorized(Role.SUPERADMIN), userServices.deleteUser);

// switch role (restaurant admin/ customer) by super admin
router.patch('/role/:id', isAuth, isAuthorized(Role.SUPERADMIN), userServices.switchRole);

// Give ratings to delivery person
router.patch('/delivery/:delvId', isAuth, isAuthorized(Role.CUSTOMER), userServices.updateDeliveryRating)

// removing order from customer profile
router.delete('/order', userServices.removeOrder)

// adding order to customer profile
router.patch('/order', userServices.addOrder)

// checks if the user and role are correct or not
router.get('/check/:uid/', isAuth, isAuthorized(Role.SUPERADMIN), userServices.checkUserValidity)

// get all users or filter get request with query params and page
router.get('/', isAuth, isAuthorized(Role.SUPERADMIN), userServices.getAllUsers);

module.exports = router;