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

router.route('/project').get(budgetController.getBudgetsOfProjects);
router.route('/monthly').get(budgetController.getMonthlyBudget);
router.route('/groupbyCategory').get(budgetController.getBudgetGroupByCategory);

router.route('/addBudget').post(validate(budgetValidation.addBudget), budgetController.addBudget);
router.route('/project/:projectId').get(validate(budgetValidation.getBudgetByProject), budgetController.getBudgetsOfProject);
router.route('/all-projects').get(budgetController.getAllBudgetsOfProjects);
router.route('/masterBudget').get(budgetController.masterBudget);
router.route('/filterBudget').get(validate(budgetValidation.filterBudgets), budgetController.filterBudget);
router.route('/monthly/:projectId').get(validate(budgetValidation.getBudgetByProject), budgetController.getMonthlyBudget);
// router.route('/monthly').get(budgetController.getMonthlyBudget);

router
  .route('/:budgetId')
  .get(validate(budgetValidation.getBudget), budgetController.getBudget)
  .patch(validate(budgetValidation.updateBudget), budgetController.updateBudget)
  .delete(validate(budgetValidation.deleteBudget), budgetController.deleteBudget);

module.exports = router;
