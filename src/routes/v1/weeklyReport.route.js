const express = require('express');
const validate = require('../../middlewares/validate');
const {weeklyReportValidation } = require('../../validations');
const {weeklyReportController } = require('../../controllers');

const router = express.Router();
  router
  .route('/:projectId')
  .get(validate(weeklyReportValidation.weeklyReport), weeklyReportController.weeklyReport);

module.exports = router;
