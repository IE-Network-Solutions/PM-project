const express = require('express');
const validate = require('../../middlewares/validate');
const  { milestoneValidation }  = require('../../validations');
const { milestoneController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(milestoneValidation.createMilestone),milestoneController.createMilestone)
  .get(validate(milestoneValidation.getMilestones),milestoneController.getMilestones);

  router
  .route('/project/:projectId')
  .get(validate(milestoneValidation.getByProject), milestoneController.getByProject);

  router
  .route('/:milestoneId')
  .get(validate(milestoneValidation.getMilestone),milestoneController.getMilestone)
  .patch(validate(milestoneValidation.updateMilestone),milestoneController.updateMilestone)
  .delete(validate(milestoneValidation.deleteMilestone),milestoneController.deleteMilestone);

module.exports = router;