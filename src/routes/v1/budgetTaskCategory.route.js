const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetTaskCategoryValidation } = require('../../validations');
const { budgetCategoryTaskController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(budgetCategoryTaskController.getAllBudgetTaskCategories)
  .post(
    validate(budgetTaskCategoryValidation.createBudgetTaskCategory),
    budgetCategoryTaskController.createBudgetTaskCategory
  );

router
  .route('/:budgetTaskCategoryId')
  .get(validate(budgetTaskCategoryValidation.getBudgetTaskCategories), budgetCategoryTaskController.getBudgetTaskCategory)
  .patch(
    validate(budgetTaskCategoryValidation.updateBudgetTaskCategory),
    budgetCategoryTaskController.updateBudgetTaskCategory
  )
  .delete(
    validate(budgetTaskCategoryValidation.deleteBudgetTaskCategory),
    budgetCategoryTaskController.deleteBudgetTaskCategory
  );

module.exports = router;
