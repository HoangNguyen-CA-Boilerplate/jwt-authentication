const jsonwebtoken = require('jsonwebtoken');
const User = require('./models/User');
const PRIV_KEY = Buffer.from(process.env.PRIV_KEY, 'base64').toString('utf-8');
const PUB_KEY = Buffer.from(process.env.PUB_KEY, 'base64').toString('utf-8');

const AppError = require('./AppError');

const issueJWT = (user) => {
  const _id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  return `Bearer ${signedToken}`;
};

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.header('authorization'))
      throw new AppError(401, 'No token provided.');

    const tokenParts = req.headers.authorization.split(' ');
    if (
      tokenParts[0] !== 'Bearer' ||
      !tokenParts[1] ||
      !tokenParts[1].match(/\S+\.\S+\.\S+/)
    )
      throw new AppError(401, 'Invalid token format.');

    const tokenPayload = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
      algorithms: ['RS256'],
    });

    const userId = tokenPayload.sub;
    const user = await User.findById(userId);

    req.user = user; // attach user to request object
    next();
  } catch (e) {
    next(new AppError(401, 'Token is missing or invalid.'));
  }
};

module.exports = {
  issueJWT,
  authMiddleware,
};
