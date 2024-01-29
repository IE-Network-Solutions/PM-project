const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation, monthlyBudgetValidation } = require('../../validations');
const { budgetController, monthlyBudgetController } = require('../../controllers');
const { route } = require('./risk.route');
const authPermision = require('../../middlewares/authPermissionStore');

const router = express.Router();

router
  .route('/')
  .post(authPermision.createProjectBudgetMiddleware, monthlyBudgetController.createMonthlyBudget)
  .get(monthlyBudgetController.getMonthlyBudget);

router.route('/month').get(monthlyBudgetController.getMonthlyBudgetByMonth);

router.route('/:id').patch(authPermision.editProjectBudgetMiddleware, monthlyBudgetController.updateMonthlyBudget);

module.exports = router;
