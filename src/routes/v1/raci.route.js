const express = require('express');
//const validate = require('../../middlewares/validate');
////const { resourceHistoryValidation } = require('../../validations');
const {raciController } = require('../../controllers')

const router = express.Router();

router
  .route('/') 
  .post(raciController.createRaci);

  router
  .route('/') 
  .get(raciController.getRacis);    
  router
  .route('/:raciId')
  .get( raciController.getRacisById);

  router
  .route('/:id')
  .delete( raciController.deleteRaciById);
 
  router
  .route('/:id')
  .patch( raciController.updateRaciById);

  router
  .route('/project/:project_id')
  .get( raciController.getRacisByProjectId);

module.exports = router;