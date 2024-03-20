const express = require('express');
const validate = require('../../middlewares/validate');
const { riskValidation } = require('../../validations');
const { riskController } = require('../../controllers');
const authPermision = require('../../middlewares/authPermissionStore');

const router = express.Router();

router
  .route('/')
  .post(authPermision.addProjectRiskMiddleware, validate(riskValidation.createRisk), riskController.createRisk)
  .get(validate(riskValidation.getRisks), riskController.getRisks);

router
  .route('/:riskId')
  .get(validate(riskValidation.getRisk), riskController.getRisk)
  .patch(authPermision.editProjectRiskMiddleware, validate(riskValidation.updateRisk), riskController.updateRisk)
  .delete(authPermision.deleteProjectRiskMiddleware, validate(riskValidation.deleteRisk), riskController.deleteRisk);

router
  .route('/riskByProject/:projectId')
  .get(validate(riskValidation.getRiskByProjectId), riskController.getAllRisksByProjectId);

router
  .route('/riskByProjectIdByDate/:projectId')
  .get(validate(riskValidation.getRiskByProjectId), riskController.getAllRisksByProjectIdAndByDate);

router
  .route('/moveRiskToIssue/:riskId')
  .delete(
    authPermision.transferProjectRiskMiddleware,
    validate(riskValidation.moveRiskToIssue),
    riskController.moveRiskToIssue
  );

router.route('/getAll/CriticalRisks').get(validate(riskValidation.getAllCriticalRisks), riskController.getAllCriticalRisks);

router
  .route('/getAllRisksAndIssuesByProjectIdByDate/:projectId')
  .get(validate(riskValidation.getAllRiskAndIssuesByProjectId), riskController.getAllRiskAndIssuesByProjectIdByDate);

router.route('/getAll/CriticalRisks/groupByProject').get(riskController.groupCriticalRiskByProject);

module.exports = router;
