const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetCategoryValidation, budgetCategoryTypeValidation } = require('../../validations');
const { budgetCategoryController, budgetCategoryTypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(budgetCategoryTypeController.getAllBudgetCategoryType)
  .post(validate(budgetCategoryTypeValidation.createBudgetCategoryType), budgetCategoryTypeController.createBudgetCategoryType);

router
  .route('/:budgetCategoryId')
  .get(validate(budgetCategoryValidation.getBudgetCategory), budgetCategoryController.getBudgetCategory)
  .patch(validate(budgetCategoryValidation.updateBudgetCategory), budgetCategoryController.updateBudgetCategory)
  .delete(validate(budgetCategoryValidation.deleteBudgetCategory), budgetCategoryController.deleteBudgetCategory);

module.exports = router;
