const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation, monthlyBudgetValidation } = require('../../validations');
const { budgetController, monthlyBudgetController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router.route('/').post(validate(monthlyBudgetValidation.addMonthlyBudget), monthlyBudgetController.createMonthlyBudget).get(monthlyBudgetController.getMonthlyBudget);
router.route('/officProject').post(monthlyBudgetController.createOfficeMonthlyBudget)
router.route('/month').get(monthlyBudgetController.getMonthlyBudgetByMonth);
router.route('/month/project').get(monthlyBudgetController.getMonthlyBudgetByMonthGroupedByProject);
router.route('/month/officProject').get(monthlyBudgetController.getMonthlyBudgetByMonthGroupedByProjectOfficeProject);

router.route('/:id').patch(monthlyBudgetController.updateMonthlyBudget);

router.route('/officProject:id').patch(monthlyBudgetController.updateOfficeMonthlyBudget);
router.route('/officProject/:projectId').get(monthlyBudgetController.getMonthlyBudgetByProject);

module.exports = router;
