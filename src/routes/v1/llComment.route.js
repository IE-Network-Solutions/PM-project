const express = require('express');
const validate = require('../../middlewares/validate');
const { LLCommentValidation } = require('../../validations');
const { LLCommentController } = require('../../controllers');
const router = express.Router();

router
    .route('/')
    .post(validate(LLCommentValidation.createLLComment), LLCommentController.createLLComment)
    .get(validate(LLCommentValidation.getLLComments), LLCommentController.getLLComments);

router
    .route('/:commentId')
    .get(validate(LLCommentValidation.getLLComment), LLCommentController.getLLCommentById)
    .patch(validate(LLCommentValidation.updateLLComment), LLCommentController.updateLLCommentById)
    .delete(validate(LLCommentValidation.deleteLLComment), LLCommentController.deleteLLCommentById);

router
    .route('/LLComment/:LLId')
    .get(validate(LLCommentValidation.getIndividualLLByLLId), LLCommentController.getIndividualLLByLLId);

module.exports = router;

