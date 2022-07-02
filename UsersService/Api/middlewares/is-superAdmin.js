const Roles = require('../../Utils/roles');

module.exports = function isSuperAdmin(role) {
    return (req, res, next) => {

        if (req.role !== Roles.SUPERADMIN) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error);
        }

        next();
    }
}
