const express = require('express');
const router = express.Router();
const { wrapAsync } = require('../../util');
const AppError = require('../../AppError');

const User = require('../../models/User.js');

// register an user
router.post(
  '/register',
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;
  })
);

module.exports = router;
