const express = require('express');
const validate = require('../../middlewares/validate');
const { individualLLValidation } = require('../../validations');
const { individualLLController } = require('../../controllers');
const authPermision = require('../../middlewares/authPermissionStore');

const router = express.Router();

router
  .route('/')
  .post(
    authPermision.insertProjectLLMiddleware,
    validate(individualLLValidation.createIndividualLL),
    individualLLController.createIndividualLL
  )
  .get(validate(individualLLValidation.getIndividualLLs), individualLLController.getIndividualLLs);

router
  .route('/:individualLLId')
  .get(validate(individualLLValidation.getIndividualLLById), individualLLController.getIndividualLLById)
  .patch(
    authPermision.editProjectLLMiddleware,
    validate(individualLLValidation.updateIndividualLLById),
    individualLLController.updateIndividualLLById
  )
  .delete(
    authPermision.deleteProjectLLMiddleware,
    validate(individualLLValidation.deleteIndividualLLById),
    individualLLController.deleteIndividualLLById
  );

module.exports = router;
