const { customError, errorHandler } = require('../../ErrorHandler/index');

module.exports = function isCustomer(role) {
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
