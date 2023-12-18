const express = require('express');
const validate = require('../../middlewares/validate');
const  { paymentTermValidation }  = require('../../validations');
const { paymentTermController } = require('../../controllers');
const { uploadOptions } = require('../../middlewares/multerUpload');
const router = express.Router();

router
  .route('/')
  .post(validate(paymentTermValidation.createPaymentTerm),paymentTermController.createPaymentTerm)
  .get(validate(paymentTermValidation.getPaymentTerms),paymentTermController.getPaymentTerms);

router
.route('/project/:projectId')
.get(validate(paymentTermValidation.getByProject), paymentTermController.getByProject);


  router
  .route('/:paymentTermId')
  .get(validate(paymentTermValidation.getPaymentTerm),paymentTermController.getPaymentTerm)
  .patch(validate(paymentTermValidation.updatePaymentTerm),paymentTermController.updatePaymentTerm)
  .delete(validate(paymentTermValidation.deletePaymentTerm),paymentTermController.deletePaymentTerm);

router
  .route('/atp/:paymentTermId')
  .patch(uploadOptions.single('atp-doc'), paymentTermController.updatePaymentTerm);

module.exports = router;
