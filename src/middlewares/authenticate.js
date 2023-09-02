const config = require('../config/config');
import { userService } from '../services';
exports.validateHeader = (req, res, next) => {
  if (req.headers.authorization) {
    var authorizationToken = req.headers.authorization.split(' ')[1];
    if (authorizationToken != null) {
      next();
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization token not found');
    }
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization headers not found');
  }
};

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const payload = jwt.verify(token, config.jwt.secret);
  console.log("PAYLOAD",payload)
  let userData=await userService.getUserById(payload)
  req.user=userData

  if (!payload) {
    throw new Error('Token not found');
  }

  next();
  // return tokenDoc;
};
