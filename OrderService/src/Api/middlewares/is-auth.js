const jwt = require('jsonwebtoken');

const { SECRET } = require('../../Config/index');

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

const customError = (msg, code) => {
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}

const errorHandler = (error) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    return error;
}