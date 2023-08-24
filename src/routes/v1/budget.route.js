const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation } = require('../../validations');
const { budgetController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
  .route('/')
  .post(validate(budgetValidation.createBudget), budgetController.createBudget)
  .get(validate(budgetValidation.getBudgets), budgetController.getBudgets);

router.route('/:budgetId');

router
  .route('/:budgetId')
  .get(validate(budgetValidation.getBudget), budgetController.getBudget)
  .patch(validate(budgetValidation.updateBudget), budgetController.updateBudget)
  .delete(validate(budgetValidation.deleteBudget), budgetController.deleteBudget);

module.exports = router;
