module.exports = function isAdmin(role) {
    return (req, res, next) => {

        if (req.user.role !== role) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            next(error);
        }

        next();
    }
}
