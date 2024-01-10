const express = require('express');
//const validate = require('../../middlewares/validate');
////const { resourceHistoryValidation } = require('../../validations');
const {stakholderController } = require('../../controllers')

const router = express.Router();

router
  .route('/') 
  .post(stakholderController.createStakHolder);

  router
  .route('/') 
  .get(stakholderController.getStakHolders);
  router
  .route('/:id')
  .get( stakholderController.getStakHoldersById);

  router
  .route('/:id')
  .delete( stakholderController.deleteStakHoldersById);
 
  router
  .route('/:id')
  .patch( stakholderController.updateStakHoldersById);

  router
  .route('/project/:project_id')
  .get( stakholderController.getStakHoldersByProject_Id);
module.exports = router;