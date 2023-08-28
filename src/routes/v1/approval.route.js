const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation } = require('../../validations');
const { approvalController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router.route('/').post(approvalController.sendForApproval);
router.route('/getCurrentApprover').get(approvalController.getCurrentApprover);

module.exports = router;
