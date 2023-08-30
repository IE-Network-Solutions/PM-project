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
    .delete(validate(lessonLearnedValidation.deleteLLById), lessonLearnedController.deleteLLById);

router
    .route('/listByProject/:projectId')
    .get(validate(lessonLearnedValidation.getLLByProjectId), lessonLearnedController.getAllLLByProjectId);

router
    .route('/listByDepartment/:departmentId')
    .get(validate(lessonLearnedValidation.getLLByDepartmentId), lessonLearnedController.getAllLLByDepartmentId);

router
    .route('/getAllLL/gropupByProject')
    .get(validate(lessonLearnedValidation.getLLByDepartmentId), lessonLearnedController.groupLLByProject);

module.exports = router;

