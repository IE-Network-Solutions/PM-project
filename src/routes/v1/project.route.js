const express = require('express');
const validate = require('../../middlewares/validate');
const { projectValidation } = require('../../validations');
const { projectController } = require('../../controllers');
const authPermision = require('../../middlewares/authPermissionStore');

const router = express.Router();

router
  .route('/')
  .post(authPermision.createProjectMiddleware, validate(projectValidation.createProject), projectController.createProject)
  .get(validate(projectValidation.getProjects), projectController.getProjects);

router.route('/office-project').post(validate(projectValidation.createOfficeProject), projectController.createProject);

router
  .route('/:projectId')
  .get(validate(projectValidation.getProjects), projectController.getProject)
  .patch(authPermision.editProjectMiddleware, validate(projectValidation.updateProject), projectController.updateProject)
  .delete(authPermision.deleteProjectMiddleware, validate(projectValidation.deleteProject), projectController.deleteProject);

router.route('/getProjectVariance/groupByProject/all').get(projectController.getAllProjectTasksVarianceByProject);
router.route('/getProjectDetail/onMasterSchedule/all').get(projectController.getAllProjectsDetailOnMasterSchedule);
router
  .route('/add-member/:projectId')
  .post(authPermision.addProjectMemberMiddleware, validate(projectValidation.addMember), projectController.addMember);
router.route('/projectMemebers/:projectId').get(projectController.getProjectMemebres);

router
  .route('/remove-member/:projectId')
  .delete(
    authPermision.removeProjectMemberMiddleware,
    validate(projectValidation.removeMember),
    projectController.removeMember
  );

router.route('/all/getTotalProjects').get(projectController.getTotalActiveClosedProjects);
router.route(authPermision.closeProjectMiddleware, '/closeproject/:projectId').patch(projectController.closeProject);
router.route('/update/:projectId').patch(validate(projectValidation.updateProjectFomSchedule), projectController.updateProjectFomSchedule)

module.exports = router;
