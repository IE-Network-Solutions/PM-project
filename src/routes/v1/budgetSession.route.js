const express = require('express');

const { BudgetSessionController, budgetCategoryController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { budgetSessionValidation } = require('../../validations');

const router = express.Router();

router.route('/').get(BudgetSessionController.getAllBudgetSessions).post((validate(budgetSessionValidation.addBudgetSession),BudgetSessionController.createBudgetSession));
router.route('/activeSession').get(BudgetSessionController.getActiveBudgetSession);
router.route('/:id').get(validate(budgetSessionValidation.getBudgetSession),BudgetSessionController.getBudgetSession).patch(validate(budgetSessionValidation.updateBudget),BudgetSessionController.updateBudgetSession);

module.exports = router;
