const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetCategoryValidation } = require('../../validations');
const { budgetCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(budgetCategoryController.getAllBudgetCategories)
  .post(validate(budgetCategoryValidation.createBudgetCategory), budgetCategoryController.createBudgetCategory);

router
  .route('/:budgetCategoryId')
  .get(validate(budgetCategoryValidation.getBudgetCategory), budgetCategoryController.getBudgetCategory)
  .patch(validate(budgetCategoryValidation.updateBudgetCategory), budgetCategoryController.updateBudgetCategory)
  .delete(validate(budgetCategoryValidation.deleteBudgetCategory), budgetCategoryController.deleteBudgetCategory);

module.exports = router;
