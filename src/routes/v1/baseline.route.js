const express = require('express');
const validate = require('../../middlewares/validate');
const { baselineValidation } = require('../../validations');
const { taskController, baselineController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
  .route('/')
  .post(baselineController.createBaseline)
  .get(validate(baselineValidation.getBaselines), baselineController.getBaselines);

router.route('/masterSchedule').get(baselineController.masterSchedule);
router.route('/masterScheduleFilter').get(baselineController.masterScheduleByDateFilter);


router.route('/milestone/:milestoneId').get(validate(baselineValidation.getByMilestone), baselineController.getByMilestone);
router.route('/project/:projectId').get(validate(baselineValidation.projectSchedule), baselineController.projectSchedule);
router.route('/project/active-baseline/:projectId').get(validate(baselineValidation.projectSchedule), baselineController.activeProjectSchedule);
router.route('/project/schedule-dashboard/:projectId').get(baselineController.scheduleDashboard);



router
  .route('/:baselineId')
  .get(validate(baselineValidation.getBaseline), baselineController.getBaseline)
  .patch(baselineController.updateBaseline)
  .delete(validate(baselineValidation.deleteBaseline), baselineController.deleteBaseline);

router.route('/comment').post(validate(baselineValidation.addComment), baselineController.addComment);

router.route('/comment/:baselineId').get(validate(baselineValidation.getComments), baselineController.getComments);


router.route('/upload/:projectId').post(baselineController.uploadBaseline);


module.exports = router;
