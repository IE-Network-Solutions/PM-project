const express = require('express');
const validate = require('../../middlewares/validate');
const { relatedIssueValidation } = require('../../validations');
const { relatedIssueController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(relatedIssueValidation.createRelatedIssue), relatedIssueController.createRelatedIssue)
    .get(validate(relatedIssueValidation.getRelatedIssues), relatedIssueController.getRelatedIssues);

router
    .route('/:relatedIssueId')
    .get(validate(relatedIssueValidation.getRelatedIssue), relatedIssueController.getRelatedIssueById)
    .patch(validate(relatedIssueValidation.updateRelatedIssueById), relatedIssueController.updateRelatedIssueById)
    .delete(validate(relatedIssueValidation.deleteRelatedIssueById), relatedIssueController.deleteRelatedIssueById);

module.exports = router;

