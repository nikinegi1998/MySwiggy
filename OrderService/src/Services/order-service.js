// installed packages
const axios = require('axios');
const { Orders } = require('../Databases/index');

// imported files
const Delivery = require('../Utils/delivery');
const { customError, errorHandler } = require('../ErrorHandler/index');
const { MENU_API, USER_API } = require('../Config/index')

/**
 * place an order by a customer
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.createOrder = async (req, res, next) => {

    try {
        const value = req.body

        const authHeader = req.get('Authorization')

        const response = await axios.get(MENU_API + '/cuisine', {
            headers: {
                Authorization: authHeader
            }
        })

        let myDish = [];
        for (let i of value) {
            for (let j of response.data.cuisine) {
                for (let k of j.dishes) {
                    if (k._id === i) {
                        if(!k.availability){
                            throw customError(`Dish with id = ${k._id} is not available `, 422)
                        }
                        myDish.push({
                            name: k.name,
                            price: k.price
                        })
                    }
                }
            }
        }

        if (!myDish)
            throw customError('No such dish exist', 422)

        const order = new Orders({
            dishes: myDish,
            customerDetails: req.user,
            orderStatus: false
        })

        const result = await order.save();

        await axios.patch(`${USER_API}/order`, {
            result: result
        })

        res.status(200).json({
            message: 'New order placed',
            order: order
        })
    }
    catch (error) {
        next(errorHandler(error));
    }
}

/**
 * get order status by customer
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.getOrderStatus = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Orders.findById(orderId);
        if (!order) {
            throw customError('No such order exist', 422)
        }

        if(req.user.email !== order.customerDetails.email)
            throw customError('You can\'t access others order status', 422)

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

/**
 * update delivery status by delivery person
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.updateDeliveryStatus = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Orders.findById(orderId);

        if (!order) {
            throw customError('No such order exist', 422)
        }

        if(!order.orderStatus)
            throw customError('Order not yet accepted by restaurant admin', 422)

        if (!order.deliveryPartner)
            order.deliveryPartner = req.user;

        if (order.deliveryPartner.email !== req.user.email)
            throw customError('Unauthorized delivery person', 403)

        let orderSts = order.deliveryStatus;

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

/**
 * update order status by the admin of the restaurant of the dish
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
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

/**
 * cancel order by customer 
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 */
exports.deleteOrder = async (req, res, next) => {

    try {
        const orderId = req.params.orderId;
        const order = await Orders.findById(orderId);

        if (!order) {
            throw customError('No such order exist', 422)
        }

        if (order.customerDetails.email !== req.user.email)
            throw customError('Not authorized to cancel the order', 403)

        const orderSts = order.deliveryStatus;

        if ((orderSts === Delivery.Reached) ||
            (orderSts === Delivery.Pickup) ||
            (orderSts === Delivery.Delivered)) {
            throw customError('You can\'t cancel order now', 401)
        }

        const check = await axios.delete(USER_API+`/order`, {
            order: order
        })

        if(check.data.message !== "Successfuly deleted")
            throw customError('You can\'t delete other users order', 403)

        await order.deleteOne({ _id: orderId })
        res.status(200).json({
            mesaage: 'Order cancelled'
        })

    }
    catch (error) {
        next(errorHandler(error));
    }

}
