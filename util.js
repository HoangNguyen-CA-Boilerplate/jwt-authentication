const jsonwebtoken = require('jsonwebtoken');
const PRIV_KEY = Buffer.from(process.env.PRIV_KEY, 'base64').toString('utf-8');
const { validationResult } = require('express-validator');

const AppError = require('./AppError');

const wrapAsync = (action) => (req, res, next) =>
  action(req, res, next).catch(next);

const issueJWT = (user) => {
  const _id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: _id,
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  return `Bearer ${signedToken}`;
};

const handleValidationErrors = (req) => {
  const errors = validationResult(req).array();
  if (errors.length === 0) return;
  throw new AppError(400, errors[0].msg);
};

module.exports = {
  wrapAsync,
  issueJWT,
  handleValidationErrors,
};
