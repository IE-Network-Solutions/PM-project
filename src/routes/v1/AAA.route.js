const express = require('express');
const validate = require('../../middlewares/validate');
const { AAAValidation } = require('../../validations');
const { AAAController } = require('../../controllers');
const authPermision = require('../../middlewares/authPermissionStore');

const router = express.Router();

router
  .route('/')
  .post(authPermision.createProjectAaaMiddleware, validate(AAAValidation.createAAA), AAAController.createAAA)
  .get(validate(AAAValidation.getAAAs), AAAController.getAAAs);

router
  .route('/:AAAId')
  .get(validate(AAAValidation.getAAA), AAAController.getAAA)
  .patch(authPermision.editProjectAaaMiddleware, validate(AAAValidation.updateAAA), AAAController.updateAAAById)
  .delete(authPermision.deleteProjectAaaMiddleware, validate(AAAValidation.deleteAAA), AAAController.deleteAAAById);

router
  .route('/AAAByProjectId/:projectId')
  .get(validate(AAAValidation.getAllAAAByProjectId), AAAController.getAllAAAByProjectId);

router.route('/getAllAAA/groupByProject').get(validate(AAAValidation.getAllAAAByProjectId), AAAController.groupAAAByProject);

module.exports = router;
