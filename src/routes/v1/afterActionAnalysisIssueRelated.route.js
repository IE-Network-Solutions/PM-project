const express = require('express');
const validate = require('../../middlewares/validate');
const { afterActionAnalysisIssueRelatedValidation } = require('../../validations');
const { afterActionAnalysisIssueRelatedController } = require('../../controllers');

const router = express.Router();

router
    .route('/:afterActionAnalysisId')
    .post(validate(afterActionAnalysisIssueRelatedValidation.createAfterActionAnalysisIssueRelated),
        afterActionAnalysisIssueRelatedController.createAfterActionAnalysisIssueRelated)
    .get(validate(afterActionAnalysisIssueRelatedValidation.getActionAnalysisIssueRelated),
        afterActionAnalysisIssueRelatedController.getafterActionAnalysisWithIssueRelated);

router.
    route('/').get(validate(afterActionAnalysisIssueRelatedValidation.getActionAnalysisIssueRelatedById),
        afterActionAnalysisIssueRelatedController.getafterActionAnalysisWithIssueRelatedById);

module.exports = router;

