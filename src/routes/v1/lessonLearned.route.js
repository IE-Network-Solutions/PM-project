const express = require('express');
const validate = require('../../middlewares/validate');
const { lessonLearnedValidation } = require('../../validations');
const { lessonLearnedController } = require('../../controllers');
const router = express.Router();

router
    .route('/')
    .post(validate(lessonLearnedValidation.createLL), lessonLearnedController.createLL)
    .get(validate(lessonLearnedValidation.getLLs), lessonLearnedController.getLLs);

router
    .route('/:LLId')
    .get(validate(lessonLearnedValidation.getLLById), lessonLearnedController.getLLById)
    .patch(validate(lessonLearnedValidation.updateLLById), lessonLearnedController.updateLLById)
    .delete(validate(lessonLearnedValidation.deleteLLById), lessonLearnedController.deleteLLById)
    .post(validate(lessonLearnedValidation.approvalRequestByPMOMLLById), lessonLearnedController.approvalRequestByPMOMLLById)
    .get(validate(lessonLearnedValidation.getAllLLByPMOMById), lessonLearnedController.getAllLLByPMOMById)
    .post(validate(lessonLearnedValidation.approvalRequestForCEO), lessonLearnedController.approvalRequestForCEO)
    .get(validate(lessonLearnedValidation.getAllLLByCEO), lessonLearnedController.getAllLLByCEO)
    .post(validate(lessonLearnedValidation.approveLLByCEO), lessonLearnedController.approveLLByCEO);

module.exports = router;

