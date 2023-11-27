const express = require('express');

const { BudgetSessionController, budgetCategoryController } = require('../../controllers');

const router = express.Router();

router.route('/').get(BudgetSessionController.getAllBudgetSessions).post((BudgetSessionController.createBudgetSession));
router.route('/:id').get(BudgetSessionController.getBudgetSession).patch(BudgetSessionController.updateBudgetSession);


module.exports = router;
