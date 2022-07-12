const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../src/Api/middlewares/is-auth')

describe('AUTHENTICATION MIDDLEWARE TESTING', function () {
    it('should throw an error if no authorization header is present', function () {

        const req = {
            get: function (headerName) {
                return null;
            }
        };

        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.')
    });

    it('should throw an error if authorization header is of length 1', function () {

        const req = {
            get: function (headerName) {
                return 'acgshjsakdakwaajj2u3';
            }
        };

        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    });

    it('should throw an error if token cannot be verified', function () {

        const req = {
            get: function (headerName) {
                return 'Bearer acgshjsakdakwaajj2u3';
            }
        };

        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    });

    it('should yeild a user from the decoded token', function () {

        const req = {
            get: function (headerName) {
                return 'Bearer xyz';
            }
        };

        sinon.stub(jwt, 'verify')
        jwt.verify.returns({user: 'New User'})

        authMiddleware(req, {}, () => { })
        expect(req).to.have.property('user')
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });
})
