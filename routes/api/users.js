const express = require('express');
const { body } = require('express-validator');

const { wrapAsync, issueJWT, handleValidationErrors } = require('../../util');
const { isAuth } = require('../../middleware/auth');
const AppError = require('../../AppError');
const User = require('../../models/User.js');

const router = express.Router();

// register an user
router.post(
  '/register',
  body('email').isEmail().withMessage('email is not valid').normalizeEmail(),
  body('password')
    .isLength({ min: 5 })
    .withMessage('password must have a minimum length of 5'),
  wrapAsync(async (req, res) => {
    handleValidationErrors(req);

    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) throw new AppError(400, 'user already exists');

    const newUser = new User({ email, password });
    const savedUser = await newUser.save();

    savedUser.password = undefined; // !important

    const jwt = issueJWT(savedUser);
    res.json({ user: savedUser, token: jwt });
  })
);

//user login
router.post(
  '/login',
  body('email').isEmail().withMessage('email is not valid').normalizeEmail(),
  body('password')
    .isLength({ min: 5 })
    .withMessage('password must have a minimum length of 5'),
  wrapAsync(async (req, res) => {
    handleValidationErrors(req);

    const { email, password } = req.body;

    const foundUser = await User.findOne({ email }).select('+password');
    if (!foundUser) throw new AppError(400, 'user does not exist');

    const isValid = await foundUser.verifyPassword(password);
    if (!isValid) throw new AppError(401, 'incorrect password');

    foundUser.password = undefined; // !important

    const jwt = issueJWT(foundUser);
    res.json({ user: foundUser, token: jwt });
  })
);

//protected route
router.get('/', isAuth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
