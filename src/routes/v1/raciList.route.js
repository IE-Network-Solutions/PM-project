const express = require('express');
//const validate = require('../../middlewares/validate');
////const { resourceHistoryValidation } = require('../../validations');
const {raciListController } = require('../../controllers')

const router = express.Router();

router
  .route('/') 
  .post(raciListController.createRaciList);

  router
  .route('/') 
  .get(raciListController.getRaciLists);    
//   router
//   .route('/:raciId')
//   .get( raciController.getRacisById);

//   router
//   .route('/:id')
//   .delete( raciController.deleteRaciById);
 
//   router
//   .route('/:id')
//   .patch( raciController.updateRaciById);


module.exports = router;