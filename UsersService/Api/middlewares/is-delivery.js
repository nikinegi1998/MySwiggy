const Roles = require('../../Utils/roles');

module.exports = function isDelivery(role) {
    return (req, res, next) => {

        if (req.role !== Roles.DELIVERY) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error);
        }

        next();
    }
}
