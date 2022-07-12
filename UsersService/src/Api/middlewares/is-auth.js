const jwt = require('jsonwebtoken');
const { SECRET } = require('../../Config/index');
const { customError, errorHandler } = require('../../ErrorHandler/index');


module.exports = (req, res, next) => {

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw customError('Not authenticated.', 401);
  }
  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  }
  catch (error) {
    next(errorHandler(error));
  }

  if (!decodedToken) {
    throw customError('Not authenticated token.', 401);
  }
  req.user = decodedToken;
  next();
}

