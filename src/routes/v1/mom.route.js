const express = require('express');
const validate = require('../../middlewares/validate');
const  { momValidation }  = require('../../validations');
const { momController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(momValidation.createMom),momController.createMom)
  .get(validate(momValidation.getMoms),momController.getMoms);

  router
  .route('/project/:projectId')
  .get(validate(momValidation.getByProject), momController.getByProject);

  router
  .route('/:momId')
  .get(validate(momValidation.getMom),momController.getMom)
  .patch(validate(momValidation.updateMom),momController.updateMom)
  .delete(validate(momValidation.deleteMom),momController.deleteMom);

module.exports = router;