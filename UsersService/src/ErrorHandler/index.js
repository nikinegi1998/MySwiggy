
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

module.exports = {
    customError: customError,
    errorHandler: errorHandler
}