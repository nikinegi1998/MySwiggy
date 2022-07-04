const express = require('express');
const { body } = require('express-validator');

const orderServices = require('../Services/order-service');

const router = express.Router();

// create new cuisine
router.post('/create', orderServices.createOrder);

// fetch order status by customer
router.get('/:orderId', orderServices.getOrderStatus);

// change delivery status by deliver boy/girl
router.patch('/deliverystatus/:orderId', orderServices.updateDeliveryStatus);

// change order status by admin
router.patch('/orderstatus/:orderId', orderServices.updateOrderStatus);

// cancel or delete order by customer
router.delete('/:orderId', orderServices.deleteOrder);

module.exports = router;