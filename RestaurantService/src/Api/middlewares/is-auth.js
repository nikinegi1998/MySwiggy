// installed packages
const jwt = require('jsonwebtoken');

// imported utility files/ config files
const { SECRET } = require('../../Config/index');
const { customError, errorHandler } = require('../../ErrorHandler/index');


module.exports = (req, res, next) => {

  // fetching values from the headers
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw customError('Not authenticated.', 401);
  }
  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    // verifying the jwt token with the secret
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

