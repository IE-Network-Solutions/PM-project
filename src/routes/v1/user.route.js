const express = require('express');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

const router = express.Router();

router.route('/').get(validate(userValidation.getUsers), userController.getUsers).patch(validate(userValidation.updateRole),userController.updateRole);
router.route('/allUses').get(validate(userValidation.getUsers), userController.getAllUsers);

router.route('/:userId').get(validate(userValidation.getUser), userController.getUser);

module.exports = router;
