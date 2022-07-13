const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');

const { TEST_ORDER_DB } = require('../src/Config/index')
const { Orders } = require('../src/Databases/index');
const orderServices = require('../src/Services/order-service');

describe('ORDER SERVICES TESTING', function () {

    before(function (done) {
        mongoose
            .connect(TEST_ORDER_DB)
            .then(result => {
                const order = new Orders({
                    name: 'test order',
                    price: 35,
                    customerDetails: {
                        email: 'test@test.com',
                        role: 'customer',
                        address: {
                            street: 'abc',
                            city: 'my city',
                            country: 'India'
                        },
                        phone: 12222222
                    },
                    orderStatus: false
                })
                return order.save();
            })
        done()
    })

    after(function (done) {
        Orders.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
        done()
    });

    it('should throw error while fetching the order', (done) => {

        const req = {
            params: { orderId: null }
        }

        orderServices.getOrderStatus(req, {}, () => { })
            .then(result => {
                expect(result).to.throw('error')
            })
        done()
    })

    it('should create new order for the customer', (done) => {
        const req = {
            body: [
                'abbbcbc', 'defeedfff'
            ],
            user: {
                _id: 'gajgjweuwweli24h',
                email: 'customer001@gmail.com',
                role: 'customer'
            }
        }

        const res = {
            status: function () { },
            json: function () { }
        }

        orderServices.createOrder(req, res, () => { }).then(result => {
            expect(result).to.have.property('orderStatus');
            expect(result.dishes).to.be.at.least(1);
        })
        done()
    })

    it('should throw error if deleting order fails', (done) => {
        sinon.stub(Orders, 'deleteOne')

        const req = {
            params: { orderId: null}
        }
        const res = {
            statusCode:500,
            status: function (code) {
                this.statusCode = code
                return this;
            },
            json: function () { }
        };

        orderServices.deleteOrder(req, res, ()=>{}).then(result=>{
            expect(result.statusCode).to.be.equal(200)
            expect(result).to.throw('error')
        })
        done()
        Orders.deleteOne.restore()
    })

    it('should throw error if order does not exist', (done)=>{
        
        const req = {
            params: { orderId: 'xaayzzz' }
        }

        orderServices.getOrderStatus(req, {}, () => { })
            .then(result => {
                expect(result).to.throw('error')
            })
        done()
    })

    it('should update the order status', (done)=>{
        const req = {
            params: { orderId: 'gge128eh9hh91k' }
        }

        sinon.stub(Orders, 'findById')

        orderServices.updateOrderStatus(req, {}, ()=>{}).then(result=>{
            expect(result.deliveryStatus).to.be.equal('otw')
            expect(result.orderStatus).to.be.equal(true)
        })

        done()
        Orders.findById.restore()
    })

    it('should throw error if updating delivery status fails', (done)=>{
        const req = {
            params: { orderId: 'gge128eh9hh91k' }
        }

        orderServices.updateDeliveryStatus(req, {}, ()=>{}).then(result=>{
            expect(result).to.throw('error')
        })

        done()
    })

})