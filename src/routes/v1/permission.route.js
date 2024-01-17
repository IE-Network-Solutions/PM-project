const express = require('express');
const validate = require('../../middlewares/validate');
const { permissionController } = require('../../controllers');
const { permissionValidation } = require('../../validations');
const authRoles = require('../../middlewares/authPermision');

const router = express.Router();

router.route('/seed').post(authRoles(['viewaaa']), permissionController.seedPermissions);
router.route('/seedResource').post(authRoles(['view_aaa']), permissionController.seedPermissionResource);
router
  .route('/assignPermissionUser')
  .post(validate(permissionValidation.assignPermissionToUser), permissionController.assignPermissionToUser);
router
  .route('/assignPermissionRole')
  .post(validate(permissionValidation.assignPermissionToRole), permissionController.assignPermissionToRole);

module.exports = router;
