const Roles = require('../../Utils/roles');

module.exports = function isAdmin(role) {
    return (req, res, next) => {

        if (req.role !== Roles.ADMIN) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error);
        }

        next();
    }
}
