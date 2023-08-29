const express = require('express');
const validate = require('../../middlewares/validate');
const { projectValidation } = require('../../validations');
const { projectController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(projectValidation.createProject), projectController.createProject)
  .get(validate(projectValidation.getProjects), projectController.getProjects);

router
  .route('/:projectId')
  .get(validate(projectValidation.getProjects), projectController.getProject)
  .patch(validate(projectValidation.updateProject), projectController.updateProject)
  .delete(validate(projectValidation.deleteProject), projectController.deleteProject);


router
  .route('/getProjectVariance/:projectId')
  .get(validate(projectValidation.getProjectVariance), projectController.getProjectVariance);

module.exports = router;