const express = require('express');
const validate = require('../../middlewares/validate');
const {weeklyReportValidation } = require('../../validations');
const {weeklyReportController } = require('../../controllers');

const router = express.Router();
  router
  .route('/:projectId')
  .get(validate(weeklyReportValidation.weeklyReport), weeklyReportController.weeklyReport);
  
  router
  .route('/all-tasks/:projectId')
  .get(validate(weeklyReportValidation.weeklyReport), weeklyReportController.allTasks);

  router
  .route('/add-sleeping-reason')
  .patch(validate(weeklyReportValidation.sleepingTasks), weeklyReportController.addSleepingReason);

  router
  .route ('/add/:projectId')
  .post(validate(weeklyReportValidation.addWeeklyReport), weeklyReportController.addWeeklyReport);

  router
  .route('/saved/:projectId')
  .get(validate(weeklyReportValidation.savedWeeklyReport), weeklyReportController.getAddedWeeklyReport);

  router
  .route('/week/:week')
  .get(validate(weeklyReportValidation.getReportByWeek), weeklyReportController.getReportByWeek);
  
  router
  .route('/comment')
  .post(validate(weeklyReportValidation.addComment), weeklyReportController.addComment);

  router
  .route('/comment/:weeklyReportId')
  .get(validate(weeklyReportValidation.getComment), weeklyReportController.getComments);


module.exports = router;
