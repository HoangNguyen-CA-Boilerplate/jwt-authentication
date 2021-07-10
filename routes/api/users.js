const express = require('express');
const { wrapAsync } = require('../../util');

const { issueJWT, authMiddleware } = require('../../jwtUtils');

const AppError = require('../../AppError');

const User = require('../../models/User.js');
const router = express.Router();

// register an user
router.post(
  '/register',
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw new AppError(400, 'Required field(s) missing.');

    const foundUser = await User.findOne({ email });
    if (foundUser) throw new AppError(400, 'User already exists.');

    const newUser = new User({ email, password });
    const savedUser = await newUser.save();

    const jwt = issueJWT(savedUser);
    res.json({ user: savedUser, token: jwt });
  })
);

//user login
router.post(
  '/login',
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw new AppError(400, 'Required field(s) missing.');

    const foundUser = await User.findOne({ email });
    if (!foundUser) throw new AppError(400, 'User does not exist.');

    const isValid = await foundUser.comparePassword(password);
    if (!isValid) throw new AppError(401, 'Incorrect Password.');

    const jwt = issueJWT(foundUser);
    res.json({ user: foundUser, token: jwt });
  })
);

//protected route
router.get('/', authMiddleware, (req, res) => {
  res.send(req.user);
});

module.exports = router;
