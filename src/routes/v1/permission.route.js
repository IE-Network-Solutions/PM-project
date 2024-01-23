const express = require('express');
const validate = require('../../middlewares/validate');
const { permissionController } = require('../../controllers');
const { permissionValidation } = require('../../validations');
const authPermision = require('../../middlewares/authPermision');
const { seedPermissionMiddleware } = require('../../middlewares/authPermissionStore');

const router = express.Router();

router.route('/seed').post(permissionController.seedPermissions);
router.route('/seedResource').post(seedPermissionMiddleware, permissionController.seedPermissionResource);
router.route('/permissionResources').get(permissionController.getResourcesWithPermission);

router
  .route('/assignPermissionUser')
  .post(validate(permissionValidation.assignPermissionToUser), permissionController.assignPermissionToUser);
router
  .route('/assignPermissionRole')
  .post(validate(permissionValidation.assignPermissionToRole), permissionController.assignPermissionToRole);

module.exports = router;
