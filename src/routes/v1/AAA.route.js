const express = require('express');
const validate = require('../../middlewares/validate');
const { AAAValidation } = require('../../validations');
const { AAAController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(AAAValidation.createAAA), AAAController.createAAA)
    .get(validate(AAAValidation.getAAAs), AAAController.getAAAs);

router
    .route('/:AAAId')
    .get(validate(AAAValidation.getAAA), AAAController.getAAA)
    .patch(validate(AAAValidation.updateAAA), AAAController.updateAAAById)
    .delete(validate(AAAValidation.deleteAAA), AAAController.deleteAAAById);

router
    .route('/AAAByProjectId/:projectId')
    .get(validate(AAAValidation.getAllAAAByProjectId), AAAController.getAllAAAByProjectId);

module.exports = router;

