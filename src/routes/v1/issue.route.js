const express = require('express');
const validate = require('../../middlewares/validate');
const { issueValidation } = require('../../validations');
const { issueController } = require('../../controllers');
const authPermision = require('../../middlewares/authPermissionStore');

const router = express.Router();

router
  .route('/')
  .post(authPermision.addProjectIssueMiddleware, validate(issueValidation.createIssue), issueController.createIssue)
  .get(validate(issueValidation.getIssues), issueController.getIssues);

router
  .route('/:issueId')
  .get(validate(issueValidation.getIssue), issueController.getIssue)
  .patch(authPermision.editProjectIssueMiddleware, validate(issueValidation.updateIssue), issueController.updateIssueById)
  .delete(
    authPermision.deleteProjectIssueMiddleware,
    validate(issueValidation.deleteIssue),
    issueController.deleteIssueById
  );

router
  .route('/issueByProjectIdByDate/:projectId')
  .get(validate(issueValidation.getIssueByProjectIdByDate), issueController.getAllIssuesByProjectIdAndByDate);

router
  .route('/issueByProjectId/:projectId')
  .get(validate(issueValidation.getIssueByProjectId), issueController.getIssueByProjectId);
  router.route('/getAll/OpenIssuesByProject').get(issueController.getAllOpenIssuesByProject);
router.route('/getAllIssues/ByDate').get(validate(issueValidation.getIssuesByDate), issueController.getIssuesByDate);


module.exports = router;
