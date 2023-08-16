const express = require('express');
const validate = require('../../middlewares/validate');
const { actionValidation } = require('../../validations');
const { actionController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(actionValidation.createAction), actionController.createAction)
    .get(validate(actionValidation.getActions), actionController.getActions);

router
    .route('/:actionId')
    .get(validate(actionValidation.getAction), actionController.getActionsById)
    .patch(validate(actionValidation.updateActionById), actionController.updateActionById)
    .delete(validate(actionValidation.deleteActionById), actionController.deleteActionById);

module.exports = router;

