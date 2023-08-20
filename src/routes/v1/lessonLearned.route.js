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


// router.route("/approvals/pm/:LLId")
//     .post(validate(lessonLearnedValidation.approvalRequestByPMOMLLById), lessonLearnedController.approvalRequestByPM);

// router.route("/approvals/pmom/:LLId")
//     .get(validate(lessonLearnedValidation.approvalRequestByPMOMLLById), lessonLearnedController.getPendingApprovalRequestByPMOMById)
//     .post(validate(lessonLearnedValidation.getAllLLByPMOMById), lessonLearnedController.approvalRequestByPMOM);
// router.route("/approvals/pmom")
//     .get(lessonLearnedController.getAllPendingApprovalRequestByPMOM)

// router.route("/approvals/ceo/:LLId")
//     .get(validate(lessonLearnedValidation.approvalRequestForCEO), lessonLearnedController.getPendingApprovalRequestByCEOById)
//     .post(validate(lessonLearnedValidation.getAllLLByCEO), lessonLearnedController.approveByCEO)
// router.route("/approvals/ceo")
//     .get(lessonLearnedController.getAllPendingApprovalRequestByCEO)

module.exports = router;

