const bcrypt = require('bcrypt');

const wrapAsync = (action) => (req, res, next) =>
  action(req, res, next).catch(next);

const genPassword = async (password) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const validPassword = async (pw, hash) => {
  const match = await bcrypt.compare(pw, hash);
  return match;
};

module.exports = {
  wrapAsync,
  genPassword,
  validPassword,
};
