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
  .route('/officProject').post(authPermision.createMonthlyOfficeBudgetMiddleware, monthlyBudgetController.createOfficeMonthlyBudget)
router.route('/month/project').get(monthlyBudgetController.getMonthlyBudgetByMonthGroupedByProject);
router.route('/month/officProject').get(monthlyBudgetController.getMonthlyBudgetByMonthGroupedByProjectOfficeProject);

router.route('/:id').patch(authPermision.editProjectBudgetMiddleware, monthlyBudgetController.updateMonthlyBudget);
router.route('/officProject/:id').patch(authPermision.editMonthlyOfficeBudgetMiddleware,  monthlyBudgetController.updateOfficeMonthlyBudget).
delete(authPermision.deleteMonthlyOfficeBudgetMiddleware,  monthlyBudgetController.deleteOfficeMontlyBudget);

router
    .route('/officeBudegtAskForApproval/:id')
    .post(authPermision.askMonthlyOfficeBudgetApprovalMiddleware , monthlyBudgetController.RequestApprovalOfficeMonthlyBudget)
router.route('/officProject/:projectId').get(monthlyBudgetController.getMonthlyBudgetByProject);
router.route('/budgetSummary').get(monthlyBudgetController.getBudgetsummary);
router.route('/approveOprationProjects').post(monthlyBudgetController.approveOpprationProjects);

module.exports = router;
