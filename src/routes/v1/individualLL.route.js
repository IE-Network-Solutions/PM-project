const express = require('express');
const validate = require('../../middlewares/validate');
const { individualLLValidation } = require('../../validations');
const { individualLLController } = require('../../controllers');
const router = express.Router();

router
    .route('/')
    .post(validate(individualLLValidation.createIndividualLL), individualLLController.createIndividualLL)
    .get(validate(individualLLValidation.getIndividualLLs), individualLLController.getIndividualLLs);

router
    .route('/:individualLLId')
    .get(validate(individualLLValidation.getIndividualLLById), individualLLController.getIndividualLLById)
    .patch(validate(individualLLValidation.updateIndividualLLById), individualLLController.updateIndividualLLById)
    .delete(validate(individualLLValidation.deleteIndividualLLById), individualLLController.deleteIndividualLLById);

module.exports = router;

