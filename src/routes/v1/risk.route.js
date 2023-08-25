const express = require('express');
const validate = require('../../middlewares/validate');
const { riskValidation } = require('../../validations');
const { riskController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(riskValidation.createRisk), riskController.createRisk)
    .get(validate(riskValidation.getRisks), riskController.getRisks);

router
    .route('/:riskId')
    .get(validate(riskValidation.getRisk), riskController.getRisk)
    .patch(validate(riskValidation.updateRisk), riskController.updateRisk)
    .delete(validate(riskValidation.deleteRisk), riskController.deleteRisk);

router
    .route('/riskByProjectIdByDate/:projectId')
    .get(validate(riskValidation.getRiskByProjectId), riskController.getAllRisksByProjectIdAndByDate);

router
    .route('/moveRiskToIssue/:riskId')
    .delete(validate(riskValidation.moveRiskToIssue), riskController.moveRiskToIssue);


router
    .route('/getAll/CriticalRisks')
    .get(validate(riskValidation.getAllCriticalRisks), riskController.getAllCriticalRisks);

router
    .route('/getAllRisksAndIssuesByProjectIdByDate/:projectId')
    .get(validate(riskValidation.getAllRiskAndIssuesByProjectId),
        riskController.getAllRiskAndIssuesByProjectIdByDate);

// router
//     .route('/getAllRisks/ByDate')
//     .get(validate(riskValidation.getRisksByDate), riskController.getRisksByDate);

module.exports = router;


