const express = require('express');
const validate = require('../../middlewares/validate');
const { resourceHistoryValidation } = require('../../validations');
const { resourceHistoryController } = require('../../controllers')

const router = express.Router();

router
  .route('/') 
  .post(resourceHistoryController.createResourceHistory);

  router
    .route('/:projectId')
    .get( resourceHistoryController.getResourceHistoryByProjectId);
    
    router
    .route('/bytask/:taskId')
    .get( resourceHistoryController.getResourceHistoryByTaskId);
    

 
module.exports = router;