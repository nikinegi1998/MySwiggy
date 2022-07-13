const { customError, errorHandler } = require('../../ErrorHandler/index');

/**
 * verifies for the correct role of the user
 * @param {role} role 
 * @returns error/ calls for the next middleware
 */
module.exports = function isAuthorized(role) {
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
