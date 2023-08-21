const express = require('express');
const validate = require('../../middlewares/validate');
const  { baselineValidation }  = require('../../validations');
const { taskController, baselineController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
  .route('/') 
  .post(validate(baselineValidation.createBaseline),baselineController.createBaseline)
  .get(validate(baselineValidation.getBaselines),baselineController.getBaselines);

  router
  .route('/milestone/:milestoneId')
  .get(validate(baselineValidation.getByMilestone), baselineController.getByMilestone);


  router
  .route('/:baselineId')
  .get(validate(baselineValidation.getBaseline),baselineController.getBaseline)
  .patch(validate(baselineValidation.updateBaseline),baselineController.updateBaseline)
  .delete(validate(baselineValidation.deleteBaseline),baselineController.deleteBaseline);

module.exports = router;