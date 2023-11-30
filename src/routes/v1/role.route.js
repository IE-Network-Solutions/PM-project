

const express = require('express');
const validate = require('../../middlewares/validate');
const { roleController } = require('../../controllers');

const router = express.Router();

router
  .route('/') 
  .get(roleController.getRoles);

  router
  .route('/:roleId')
  .get(roleController.getRole)

module.exports = router;