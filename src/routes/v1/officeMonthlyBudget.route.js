const express = require('express');
const validate = require('../../middlewares/validate');
const { officeBudgetValidation } = require('../../validations');
const { budgetController, officeMonthlyBudgetController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
    .route('/')
    .post(validate(officeBudgetValidation.createBudget), officeMonthlyBudgetController.createMonthlyBudget)

router.route('/month/:projectId/:from/:to').get(validate(officeBudgetValidation.getBudgetByProject), officeMonthlyBudgetController.getMonthlyBudgetByMonth);



router.route('/:id').patch(validate(officeBudgetValidation.updateBudget), officeMonthlyBudgetController.updateMonthlyBudget).delete(validate(officeBudgetValidation.deleteBudget), officeMonthlyBudgetController.DeleteMonthlyBudget);


module.exports = router