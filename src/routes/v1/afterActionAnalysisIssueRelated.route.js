const express = require('express');
const validate = require('../../middlewares/validate');
const { afterActionAnalysisIssueRelatedValidation } = require('../../validations');
const { afterActionAnalysisIssueRelatedController } = require('../../controllers');

const router = express.Router();

router
    .route('/:afterActionAnalysisId')
    .post(validate(afterActionAnalysisIssueRelatedValidation.createAfterActionAnalysisAction),
        afterActionAnalysisIssueRelatedController.createAfterActionAnalysisIssueRelated)
    .get(validate(afterActionAnalysisIssueRelatedValidation.getActionAnalysisActionById),
        afterActionAnalysisIssueRelatedController.getafterActionAnalysisWithIssueRelated);

router.
    route('/').get(validate(afterActionAnalysisIssueRelatedValidation.getActionAnalysisActions),
        afterActionAnalysisIssueRelatedController.getafterActionAnalysisWithIssueRelatedById);

module.exports = router;

