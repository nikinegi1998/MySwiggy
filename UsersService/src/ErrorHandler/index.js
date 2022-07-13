/**
 * creates new instance of error with message and status code
 * @param {Message} msg 
 * @param {StatusCode} code 
 * @returns error 
 */
const customError = (msg, code) => {
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}

/**
 * Fetch the error details if any else return server error details
 * @param {error} error 
 * @returns error
 */
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