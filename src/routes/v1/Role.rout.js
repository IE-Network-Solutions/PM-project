const express = require('express');
const validate = require('../../middlewares/validate');
const { riskValidation } = require('../../validations');
const { role } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(riskValidation.createRisk), riskController.createRisk)
  .get(validate(riskValidation.getRisks), riskController.getRisks);