const express = require('express');
const validate = require('../../middlewares/validate');
const { taskValidation } = require('../../validations');
const { taskController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(taskValidation.createTask), taskController.createTask)
  .get(validate(taskValidation.getTasks), taskController.getTasks);

router
  .route('/:taskId')
  .get(validate(taskValidation.getTask), taskController.getTask)
  .patch(validate(taskValidation.updateTask), taskController.updateTask)
  .delete(validate(taskValidation.deleteTask), taskController.deleteTask);

router.route('/assign-resource').post(validate(taskValidation.assignAllResource), taskController.assignAllResource);
router.route('/remove-resource/:taskId').post(validate(taskValidation.removeResource), taskController.removeResource);
router
  .route('/by-planed-date/:projectId')
  .get(validate(taskValidation.getByPlnedDate), taskController.getTasksByPlandStartDate);

module.exports = router;
