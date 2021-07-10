const bcrypt = require('bcrypt');

const wrapAsync = (action) => (req, res, next) =>
  action(req, res, next).catch(next);

module.exports = {
  wrapAsync,
};
