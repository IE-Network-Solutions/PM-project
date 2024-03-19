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
router
  .route('/officProject').post(authPermision.createProjectBudgetMiddleware, monthlyBudgetController.createOfficeMonthlyBudget)
router.route('/month/project').get(monthlyBudgetController.getMonthlyBudgetByMonthGroupedByProject);
router.route('/month/officProject').get(monthlyBudgetController.getMonthlyBudgetByMonthGroupedByProjectOfficeProject);

router.route('/:id').patch(authPermision.editProjectBudgetMiddleware, monthlyBudgetController.updateMonthlyBudget);

router.route('/officProject:id').patch(monthlyBudgetController.updateOfficeMonthlyBudget);
router
    .route('/officeBudegtAskForApproval/:id')
    .post(monthlyBudgetController.RequestApprovalOfficeMonthlyBudget)
router.route('/officProject/:projectId').get(monthlyBudgetController.getMonthlyBudgetByProject);

module.exports = router;
