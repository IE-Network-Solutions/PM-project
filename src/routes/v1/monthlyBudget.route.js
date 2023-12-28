const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation,monthlyBudgetValidation } = require('../../validations');
const { budgetController, monthlyBudgetController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
  .route('/')
  .post(monthlyBudgetController.createMonthlyBudget)
  .get(monthlyBudgetController.getMonthlyBudget);

router.route('/month').get(monthlyBudgetController.getMonthlyBudgetByMonth);


router.route('/:id').patch(monthlyBudgetController.updateMonthlyBudget);

module.exports = router