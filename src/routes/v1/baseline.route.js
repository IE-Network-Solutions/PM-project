const express = require('express');
const validate = require('../../middlewares/validate');
const { baselineValidation } = require('../../validations');
const { taskController, baselineController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
  .route('/')
  .post(validate(baselineValidation.createBaseline), baselineController.createBaseline)
  .get(validate(baselineValidation.getBaselines), baselineController.getBaselines);

router.route('/masterSchedule').get(baselineController.masterSchedule);

router.route('/milestone/:milestoneId').get(validate(baselineValidation.getByMilestone), baselineController.getByMilestone);

router
  .route('/:baselineId')
  .get(validate(baselineValidation.getBaseline), baselineController.getBaseline)
  .patch(validate(baselineValidation.updateBaseline), baselineController.updateBaseline)
  .delete(validate(baselineValidation.deleteBaseline), baselineController.deleteBaseline);

router.route('/comment').post(validate(baselineValidation.addComment), baselineController.addComment);

router.route('/comment/:baselineId').get(validate(baselineValidation.getComments), baselineController.getComments);

module.exports = router;
