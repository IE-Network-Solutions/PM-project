const express = require('express');
const validate = require('../../middlewares/validate');
const { permissionController } = require('../../controllers');
const { permissionValidation } = require('../../validations');
const authRoles = require('../../middlewares/authPermision');

const router = express.Router();

router.route('/seed').post(authRoles(['view_aaa']),permissionController.seedPermissions);
router.route('/assignPermissionUser').post(validate(permissionValidation.assignPermissionToUser),permissionController.assignPermissionToUser);
router.route('/assignPermissionRole').post(validate(permissionValidation.assignPermissionToRole),permissionController.assignPermissionToRole);

module.exports = router;