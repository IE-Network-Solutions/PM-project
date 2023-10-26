const express = require('express');
const validate = require('../../middlewares/validate');
const { resourceHistoryValidation } = require('../../validations');
const { resourceHistoryController } = require('../../controllers')

const router = express.Router();

router
  .route('/') 
  .post(resourceHistoryController.createResourceHistory);
  router
  .route('/') 
  .get(resourceHistoryController.getAllResourceHistory);

  router
    .route('/:projectId')
    .get( resourceHistoryController.getResourceHistoryByProjectId);
    
    router
    .route('/bytask/:taskId')
    .get( resourceHistoryController.getResourceHistoryByTaskId);
    
    router
    .route('/byuser/:userId')
    .get( resourceHistoryController.getResourceHistoryByUserId);
    

 
module.exports = router;