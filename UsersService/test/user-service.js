const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const userService = require('../src/Services/user')
const User = require('../src/Databases/Models/user')


describe('USER SERVICE TESTING', function () {

    before(function (done) {
        mongoose
            .connect(
                'mongodb+srv://nikki:z719yEvUAZwuyxXM@cluster0.130pt.mongodb.net/Test-Swiggy-Users?retryWrites=true&w=majority'
            )
            .then(result => {
                const user = new User([{
                    role: 'superadmin',
                    email: 'test@test.com',
                    password: '12345',
                    phone: 1222222,
                    address: {},
                    _id: '5c0f66b979af55031b34728a'
                }, {
                    role: 'admin',
                    email: 'testAdmin@test.com',
                    password: '12345',
                    phone: 1222222,
                    address: {},
                    _id: '5c0f66b979af55031b34728b'
                }]);
                return user.save();
            })
            .then(() => {
                done();
            });
        done()
    });

    it('should throw error if user not present in database', function (done) {
        const req = {};
        const res = {
            statusCode: 500,
            user: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.user = data
            }
        };

        userService.getAllUsers(req, res, () => { }).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.user).to.be.equal({
                email: 'test@test.com',
                phone: 1222222,
                address: {}
            });
            done()
        })
        done()
    });

    it('should throw an error with code 500 if accessing the database fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: '12345'
            }
        };

        userService.loginUser(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should throw error with code 422 if user already exist in database', function (done) {
        sinon.stub(User, 'findOne')
        User.findOne.throws()

        const req = {
            body: {
                email: 'admin1@gmail.com',
                password: '12345'
            }
        }

        userService.registerUser(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 422);
            done();
        })

        User.findOne.restore();
    })

    it('should throw error if user id is not present', function (done) {
        sinon.stub(User, 'findById')
        User.findById.throws()

        const req = {
            params: {
                id: 'xyz'
            }
        }

        userService.switchRole(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode')
            done()
        })
        User.findById.restore()
        done()
    })

    it('should switch the role of user in response', function (done) {
        sinon.stub(User, 'findById')
        User.findById.throws()

        const req = {
            params: { id: '5c0f66b979af55031b34728b' }
        }
        const res = {
            statusCode: 500,
            user: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.role = data;
                if (data.role === 'admin')
                    this.user.role = 'customer'
                else
                    this.user.role = 'admin'
            }
        }

        userService.switchRole(req, res, () => { }).then(() => {
            expect(res.statusCode).to.have.property('role');
            // expect(res.user).to.be.equal({
            //     role: 'admin',
            //     email: 'testAdmin@test.com',
            //     phone: 1222222,
            //     address: {}
            // });
            done()
        })
        done()
        User.findById.restore()
    })

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });

        done()
    });

});