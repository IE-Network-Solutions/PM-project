const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation } = require('../../validations');
const { approvalModuleController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router.route('/').get(approvalModuleController.getApprovalModules).post(approvalModuleController.approvalModule);

module.exports = router;
