const express = require('express');
const validate = require('../../middlewares/validate');
const { officeBudgetValidation } = require('../../validations');
const { budgetController, officeQuarterlyBudgetController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
    .route('/')
    .post(validate(officeBudgetValidation.createBudget), officeQuarterlyBudgetController.createQuarterlyBudget)

router.route('/month/:projectId/:from/:to').get(validate(officeBudgetValidation.getBudgetByProject), officeQuarterlyBudgetController.getQuarterlyBudgetByMonth);
router
    .route('/askForApproval/:id')
    .post(officeQuarterlyBudgetController.RequestApprovalQuarterlyBudget)

router
    .route('/manager/:id')
    .get(officeQuarterlyBudgetController.getAllQuarterlyBudgetByProject)





router.route('/:id').patch(validate(officeBudgetValidation.updateBudget), officeQuarterlyBudgetController.updateQuarterlyBudget).delete(validate(officeBudgetValidation.deleteBudget), officeQuarterlyBudgetController.DeleteQuarterlyBudget);
router


module.exports = router