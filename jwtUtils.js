const jsonwebtoken = require('jsonwebtoken');
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

const authMiddleware = (req, res, next) => {
  next(new AppError(401, 'You are not authorized.'));
};

module.exports = {
  issueJWT,
  authMiddleware,
};
