const express = require('express');
const { body } = require('express-validator');

const orderServices = require('../Services/order-service');
const { isAuth, isAuthorized } = require('./middlewares/index')
const Roles = require('../../../Utils/roles');

const router = express.Router();

// create new order
router.post('/create', isAuth, isAuthorized(Roles.CUSTOMER), orderServices.createOrder);

// fetch order status by customer
router.get('/:orderId', isAuth, isAuthorized(Roles.CUSTOMER), orderServices.getOrderStatus);

// change delivery status by deliver boy/girl
router.patch('/deliverystatus/:orderId', isAuth, isAuthorized(Roles.DELIVERY), orderServices.updateDeliveryStatus);

// change order status by admin
router.patch('/orderstatus/:orderId', isAuth, isAuthorized(Roles.ADMIN), orderServices.updateOrderStatus);

// cancel or delete order by customer
router.delete('/:orderId', isAuth, isAuthorized(Roles.CUSTOMER), orderServices.deleteOrder);

module.exports = router;