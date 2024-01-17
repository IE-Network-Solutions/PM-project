const express = require('express');

const { officeBudgetSessioncontroller } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { budgetSessionValidation } = require('../../validations');

const router = express.Router();

router.route('/').get(officeBudgetSessioncontroller.getAllBudgetSessions).post((validate(budgetSessionValidation.addBudgetSession), officeBudgetSessioncontroller.createBudgetSession));
router.route('/activeSession').get(officeBudgetSessioncontroller.getActiveBudgetSession);
router.route('/:id').get(validate(budgetSessionValidation.getBudgetSession), officeBudgetSessioncontroller.getBudgetSession).patch(validate(budgetSessionValidation.updateBudget), officeBudgetSessioncontroller.updateBudgetSession);

module.exports = router;
