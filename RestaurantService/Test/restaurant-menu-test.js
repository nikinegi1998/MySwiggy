const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
const axios = require('axios')

const { RestaurantModel, MenuModel } = require('../src/Databases/index');
const { RESTAURANT_TEST_DB, MENU_TEST_DB, USER_API } = require('../src/Config/index');
const restrServices = require('../src/Services/restaurant-service');
const menuServices = require('../src/Services/menu-service');

describe('RESTAURANT AND MENU SERVICE TESTING', function () {

    describe('RESTAURANT----------', function () {
        before(function (done) {
            mongoose
                .connect(RESTAURANT_TEST_DB)
                .then(result => {
                    const restaurant = new RestaurantModel({
                        name: 'test restaurant',
                        location: 'California'
                    })
                    return restaurant.save();
                })
            done()
        })

        after(function (done) {
            RestaurantModel.deleteMany({})
                .then(() => {
                    return mongoose.disconnect();
                })
                .then(() => {
                    done();
                });
            done()
        });

        it("should create a new restaurant", function (done) {

            sinon.stub(RestaurantModel, 'findOne')
            RestaurantModel.findOne.throws()
            const name = "My test restaurant";
            const location = "California";

            const req = {
                body: {
                    name: name,
                    location: location
                }
            }
            const res = {
                status: function () {
                    return this;
                },
                json: function () { }
            };

            restrServices.createRestaurant(req, res, () => { }).then(result => {
                expect(result).to.have.property('name');
                expect(result).to.have.property('location');
                done();
            })

            RestaurantModel.findOne.restore()
            done()
        });

        it('should throw an error if restaurant id does not exist', function (done) {
            sinon.stub(RestaurantModel, 'findById')
            RestaurantModel.findById.throws()

            const req = {
                params: { rId: 'xyz' }
            }

            restrServices.deleteRestaurant(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);

                done()
            })
            done()
            RestaurantModel.findById.restore()
        })

        it('should delete a restaurant from its id', function (done) {
            sinon.stub(RestaurantModel, 'findById')
            RestaurantModel.findById.throws()

            const req = {
                params: { rId: '62cdd0d4a3373ff0350aaf3b' }
            }

            restrServices.deleteRestaurant(req, {}, () => { }).then(result => {
                done()
            })
            RestaurantModel.findById.restore()
        })

        it('should update the ratings of the restaurant', function (done) {
            sinon.stub(RestaurantModel, 'findOne')
            RestaurantModel.findOne.throws()

            const req = {
                params: { rId: '62cdd0d4a3373ff0350aaf3b' },
                body: { rate: 4 }
            }

            const res = {
                status: function () {
                    return this;
                },
                json: function () { }
            };

            restrServices.createRestaurant(req, res, () => { }).then(result => {
                expect(result).to.have.property('ratings');
                expect(result).to.have.property('location');
                done();
            })

            done()
            RestaurantModel.findOne.restore()
        })

        it('should throw an error if ratings cannot be updated', function (done) {
            sinon.stub(RestaurantModel, 'findById')
            RestaurantModel.findById.throws()

            const req = {
                params: { rId: 'xyz' }
            }

            restrServices.deleteRestaurant(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);

                done()
            })
            done()
            RestaurantModel.findById.restore()
        })

        it('should give all the restaurants details', function (done) {
            sinon.stub(RestaurantModel, 'find')
            RestaurantModel.find()

            restrServices.getAllRestaurants({}, {}, () => { }).then(result => {
                expect(result.forEach).to.have.property('name')
                expect(result.forEach).to.have.property('location')
                done()
            })

            done();
            RestaurantModel.find.restore()
        })


        it('should return the successful API call', (done) => {

            sinon.stub(axios, 'get')
            axios.get(`${USER_API}/?type=admin`, {
                headers: {
                    Authorization: 'Bearer lkhugtrdxdd997inj0'
                }
            })

            restrServices.addAdmin({}, {}, () => { }).then(result => {
                expect(result).to.have.property('email')
                expect(result).to.have.property('phone')
                done()
            })
            done()
            axios.stub.restore()
        })


    })

    describe('MENU----------------', function () {

        before(function (done) {
            mongoose
                .connect(MENU_TEST_DB)
                .then(result => {
                    const restaurant = new MenuModel({
                        cuisine: 'test cuisine',
                        _id: 'abshjsk2kj2jkll28b'
                    })
                    return restaurant.save();
                })
                .then(() => {
                    done()
                })
            done()
        })

        after(function (done) {
            MenuModel.deleteMany({})
                .then(() => {
                    return mongoose.disconnect();
                })
                .then(() => {
                    done();
                });

            done()
        });

        it('should throw an error if restaurant doesn\'t exist', function (done) {
            sinon.stub(RestaurantModel, 'findById')
            RestaurantModel.findById.throws();

            const req = {
                params: { rid: 'xyz' },
                body: { cuisine: 'temporary cuisine' }
            }

            menuServices.createCuisine(req, {}, () => { }).then(result => {
                expect(result).to.throw.an('error')
                done()
            })
            done()
            RestaurantModel.findById.restore()
        })

        it('should create new cuisine ', function (done) {

            const temp = new MenuModel({
                cuisine: 'Temporary cuisine'
            })
            temp.save().then(() => {
                assert(!temp.isNew);
                done()
            })
            done()
        })

        it('should delete the existing cuisine', (done) => {
            sinon.stub(MenuModel, 'deleteOne')
            MenuModel.deleteOne();

            const req = {
                params: { menuId: 'abshjsk2kj2jkll28b' }
            }

            menuServices.deleteCuisine(req, {}, () => { }).then(result => {
                assert(result === null)
                done()
            })

            done()
            MenuModel.deleteOne.restore()
        })

        it('should throw error if no cuisine exist', (done) => {
            sinon.stub(MenuModel, 'find')

            const res = {
                statusCode: 500,
                cuisine: null,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (data) {
                    this.cuisine = data
                }
            };

            menuServices.getCuisines({}, res, () => { }).then(result => {
                assert(result === null)
                expect(result).to.be.an('error')
                done()
            })

            done()
            MenuModel.find.restore()
        })

        it('should throw an error if creating dish failed', (done) => {
            const req = {
                params: { menuId: null },
                body: {
                    name: 'puran poli',
                    ingredients: ['rava', 'tomato', 'oil'],
                    veg: true,
                    price: 18,
                    availability: 60
                }
            }

            menuServices.createDish(req, {}, () => { }).then(result => {
                expect(result).to.throws()
                done()
            })

            done()
        })

        it('should update existing dish', (done) => {
            const req = {
                params: { menuId: 'abshjsk2kj2jkll28b' },
                body: {
                    dishId: 'asd3gj-ffdxgh-ggg78uk-tkkkj6',
                    name: 'puran poli',
                    ingredients: ['rava', 'tomato', 'oil'],
                    veg: true,
                    price: 18,
                    availability: 60
                }
            }

            const res = {
                statusCode: 500,
                dish: null,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (data) {
                    this.dish = data
                }
            };

            menuServices.updateDish(req, res, () => { }).then(result => {
                expect(result).to.have.property('name')
                expect(result).to.have.property('ingredients')
                expect(result).to.have.property('dishId')

                done()
            })
            done()
        })
    })

})