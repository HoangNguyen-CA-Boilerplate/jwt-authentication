const express = require('express');
const router = express.Router();
const { wrapAsync } = require('../../util');
const AppError = require('../../AppError');

router.get(
  '/',
  wrapAsync(async (req, res) => {
    res.send('hello world');
  })
);

module.exports = router;
