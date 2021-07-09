module.exports.wrapAsync = (action) => (req, res, next) =>
  action(req, res, next).catch(next);
