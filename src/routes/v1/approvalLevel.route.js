const express = require('express');
const validate = require('../../middlewares/validate');
const { budgetValidation } = require('../../validations');
const { approvalLevelController } = require('../../controllers');
const { route } = require('./risk.route');

const router = express.Router();

router.route('/').get(approvalLevelController.getApprovalLevels).post(approvalLevelController.approvalLevel);

module.exports = router;
