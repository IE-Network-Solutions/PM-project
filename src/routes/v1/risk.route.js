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

module.exports = router;

