const express = require('express');
const validate = require('../../middlewares/validate');
const  { subTaskValidation }  = require('../../validations');
const { subTaskController } = require('../../controllers');

const router = express.Router();

router
  .route('/') 
  .post(validate(subTaskValidation.createSubTask),subTaskController.createSubTask)
  .get(validate(subTaskValidation.getSubTasks),subTaskController.getSubTasks);

  router
  .route('/:subTaskId')
  .get(validate(subTaskValidation.getSubTask),subTaskController.getSubTask)
  .patch(validate(subTaskValidation.updateSubTask),subTaskController.updateSubTask)
  .delete(validate(subTaskValidation.deleteSubTask),subTaskController.deleteSubTask);

module.exports = router;