const express = require('express');


const { clientController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
   
    .get(clientController.getAllClients);




module.exports = router;

