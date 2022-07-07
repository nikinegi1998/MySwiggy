const { customError, errorHandler } = require('../../ErrorHandler/index');

module.exports = function isSuperAdmin(role) {
    return (req, res, next) => {
        try {
            if (req.user.role !== role) {
                throw customError('Not authhorized', 403)
            }

            next();
        }
        catch (error) {
            next(errorHandler(error))
        }

    }
}
