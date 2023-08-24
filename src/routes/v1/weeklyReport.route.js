const express = require('express');
const validate = require('../../middlewares/validate');
const { weeklyReportValidation } = require('../../validations');
const { weeklyReportController } = require('../../controllers');
const router = express.Router();

router
    .route('/:projectId')
    .get(validate(weeklyReportValidation.getWeeklyReportByDate),
        weeklyReportController.getWeeklyReportByProjectByDate)

module.exports = router;


