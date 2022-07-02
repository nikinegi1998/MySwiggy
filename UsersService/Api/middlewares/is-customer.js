const Roles = require('../../Utils/roles');

module.exports = function isCustomer(role) {
    return (req, res, next) => {

        if (req.role !== Roles.CUSTOMER) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error);
        }

        next();
    }
}
