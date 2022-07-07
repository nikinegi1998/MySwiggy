const jwt = require('jsonwebtoken');

const { SECRET } = require('../../Config/index');
const { customError, errorHandler } = require('../../ErrorHandler/index');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader)
            throw customError('Not authenticated', 401);

        const token = authHeader.split(' ')[1];
        let decodedToken = jwt.verify(token, SECRET);
        
        if (!decodedToken) {
            throw customError('Not authenticated', 401);;
        }
        req.user = decodedToken;

        next();
    }
    catch (error) {
        next(errorHandler(error))
    }
}
