const express = require('express');
const { currencyController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(currencyController.getCurrencies);

module.exports = router;