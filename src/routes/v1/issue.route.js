const express = require('express');
const validate = require('../../middlewares/validate');
const { issueValidation } = require('../../validations');
const { issueController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(issueValidation.createIssue), issueController.createIssue)
    .get(validate(issueValidation.getIssues), issueController.getIssues);

router
    .route('/:issueId')
    .get(validate(issueValidation.getIssue), issueController.getIssue)
    .patch(validate(issueValidation.updateIssue), issueController.updateIssueById)
    .delete(validate(issueValidation.deleteIssue), issueController.deleteIssueById);

router
    .route('/issueByProjectId/:projectId')
    .get(validate(issueValidation.getIssueByProjectId), issueController.getIssueByProjectId);
router
    .route('/getAllIssues/ByDate')
    .get(validate(issueValidation.getIssuesByDate), issueController.getIssuesByDate);


module.exports = router;

