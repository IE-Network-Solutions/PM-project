const express = require('express');
const validate = require('../../middlewares/validate');
const { accountablityvalidation } = require('../../validations');
const { accountablityController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(accountablityvalidation.createAccountablity), accountablityController.createAccountablity)
    .get(validate(accountablityvalidation.getAccountablityies), accountablityController.getAccountablities);

router
    .route('/:accId')
    .get(validate(accountablityvalidation.getAccountablity), accountablityController.getAccountablityById)
    .patch(validate(accountablityvalidation.updateAccountablityById), accountablityController.updateAccountablityById)
    .delete(validate(accountablityvalidation.deleteAccountablityById), accountablityController.deleteAccountablityById);

module.exports = router;

