const express = require('express');
const validate = require('../../middlewares/validate');
const { permissionController } = require('../../controllers');
const { permissionValidation } = require('../../validations');
const authRoles = require('../../middlewares/authPermision');

const router = express.Router();

router.route('/seed').post(authRoles(['view_aaa']),permissionController.seedPermissions);
router.route('/assignPermission').post(validate(permissionValidation.assignPermissionToUser),permissionController.assignPermissionToUser);

module.exports = router;