const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation } = require('../../validations');
const { approvalModuleController, approvalStageController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router.route('/').get(approvalStageController.getApprovalStages).post(approvalStageController.createApprovalStage);

module.exports = router;
