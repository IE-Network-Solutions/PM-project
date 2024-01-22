const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetTypeValidation } = require('../../validations');
const { budgetTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(budgetTypeController.getAllBudgetTypes)

  .post(validate(budgetTypeValidation.createBudgetType), budgetTypeController.createBudgetType);

router
  .route('/office')
  .get(budgetTypeController.getAllOfficeBudgetTypes)

router
  .route('/:budgetTypeId')
  .get(validate(budgetTypeValidation.getBudgetType), budgetTypeController.getBudgetType)
  .patch(validate(budgetTypeValidation.updateBudgetType), budgetTypeController.updateBudgetType)
  .delete(validate(budgetTypeValidation.deleteBudgetType), budgetTypeController.deleteBudgetType);



module.exports = router;
