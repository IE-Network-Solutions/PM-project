const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation } = require('../../validations');
const { budgetController, officeMonthlyBudgetController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router
    .route('/')
    .post(officeMonthlyBudgetController.createMonthlyBudget)


router.route('/month').get(officeMonthlyBudgetController.getMonthlyBudgetByMonth);


router.route('/:id').patch(officeMonthlyBudgetController.updateMonthlyBudget);

module.exports = router