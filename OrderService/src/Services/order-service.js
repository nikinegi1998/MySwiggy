const { Orders } = require('../Databases/index');
const Delivery = require('../Utils/delivery');
const { validationResult } = require('express-validator');

exports.createOrder = async (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw customError('Validation error in register', 422)
        }
        
        const { name, price, customerId } = req.body;

        const order = new Orders({
            dishes: [{ name: name, price: price }],
            customerDetails: customerId,
            orderStatus: false
        })

        await order.save();

        res.status(200).json({
            mesaage: 'New order placed',
            order: order
        })
    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.getOrderStatus = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Orders.findById(orderId);
        if (!order) {
            throw customError('No such order exist', 422)
        }

        const orderstatus = order.orderStatus;

        var delivery;

        if (orderstatus) {
            delivery = order.deliveryStatus,
                res.status(200).json({
                    mesaage: 'Order status',
                    orderStatus: orderstatus,
                    deliverStatus: delivery
                })
        }
        else {
            res.status(200).json({
                mesaage: 'Order status',
                orderStatus: orderstatus
            })
        }
    }
    catch (error) {
        next(errorHandler(error));
    }
}

exports.updateDeliveryStatus = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Orders.findById(orderId);

        if (!order) {
            throw customError('No such order exist', 422)
        }

        const orderSts = order.deliveryStatus;

        if (orderSts === Delivery.OnTheWay) {
            orderSts = Delivery.Reached
        }
        else if (orderSts === Delivery.Reached) {
            orderSts = Delivery.Pickup
        }
        else if (orderSts === Delivery.Pickup) {
            orderSts = Delivery.Delivered
        }
        else if (orderSts === Delivery.Delivered) {
            orderSts = orderSts
        }

        order.deliveryStatus = orderSts;
        await order.save()

        res.status(200).json({
            mesaage: 'Delivery status',
            order: order
        })

    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.updateOrderStatus = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Orders.findById(orderId);

        if (!order) {
            throw customError('No such order exist', 422)
        }

        if (!order.orderStatus) {
            order.orderStatus = true;
            order.deliveryStatus = Delivery.OnTheWay;
        }
        else {
            order.orderStatus = false;
            order.deliveryStatus = '';
        }

        await order.save()

        res.status(200).json({
            mesaage: 'Order status updated',
            order: order
        })

    }
    catch (error) {
        next(errorHandler(error));
    }

}

exports.deleteOrder = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Orders.findById(orderId);

        if (!order) {
            throw customError('No such order exist', 422)
        }

        const orderSts = order.deliveryStatus;

        if ((orderSts === Delivery.Reached) ||
            (orderSts === Delivery.Pickup) ||
            (orderSts === Delivery.Delivered)) {
            throw customError('You can\'t cancel order now', 401)
        }

        await order.deleteOne({ _id: orderId })
        res.status(200).json({
            mesaage: 'Order cancelled'
        })

    }
    catch (error) {
        next(errorHandler(error));
    }

}


const customError = (msg, code) => {
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}

const errorHandler = (error) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    return error
}