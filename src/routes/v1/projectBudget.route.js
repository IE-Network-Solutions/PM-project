const express = require('express');
const validate = require('../../middlewares/validate');
const { projectValidation } = require('../../validations');
const { projectController, projectBudgetController } = require('../../controllers');
const { projectBudgetService } = require('../../services');

const router = express.Router();

router.route('/:projectId').get(projectBudgetController.getProjectBudgets);

module.exports = router;
