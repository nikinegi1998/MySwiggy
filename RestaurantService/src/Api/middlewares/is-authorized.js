const { customError, errorHandler } = require('../../ErrorHandler/index');


module.exports = function isAuthorized(role) {
    return (req, res, next) => {

        try {
            if (req.user.role !== role) {
                throw customError('Not authorized', 403)
            }

            next();
        }
        catch (error) {
            next(errorHandler(error))
        }
    }
}
