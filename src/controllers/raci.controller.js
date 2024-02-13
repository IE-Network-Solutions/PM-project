const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { raciService} = require('../services');

const createRaci = catchAsync(async (req, res) => {
  try {
    // Assuming stakholderService.createStakHolder accepts project ID and stakholder data
    const raci = await raciService.createRaci(req.body);
    // Include other fields here

    res.status(httpStatus.CREATED).send(raci);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
  }
});

const getRacis= catchAsync(async(req, res) => {
    const racis =await raciService.getRacis();
    res.status(httpStatus.OK).send(racis);
})

const getRacisById = catchAsync(async(req,res) => {
    const raciId=req.params.raciId;
    const raci = await raciService.getRacisById(raciId);

    if(!raci){
        return res.status(httpStatus.NOT_FOUND).send({  error: 'Raci not found'});
    }

    res.status(httpStatus.OK).send(raci);
})

const deleteRaciById = catchAsync(async (req, res) => {
    try {
      const raciId = req.params.id; // Assuming the ID is in the request parameters
      await raciService.deleteRaciById(raciId);
      res.status(httpStatus.NO_CONTENT).send(); // No content to send on successful deletion
    } catch (error) {
      // Handle errors appropriately, e.g., return a 404 status if the stakholder is not found
      console.error(error);
      res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
    }
  });


  const updateRaciById = catchAsync(async (req, res) => {
    try {
      const raciId = req.params.id;
      const updatedRaci = await raciService.updateRaciById(raciId, req.body);
  
      if (!updatedRaci) {
        // Handle case where the stakholder is not found
        return res.status(httpStatus.NOT_FOUND).send({ error: 'Raci not found' });
      }
  
      res.status(httpStatus.OK).send(updatedRaci);
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
    }
  });
  const getRacisByProjectId = catchAsync(async (req, res) => {
    try {
      const projectId = req.params.project_id;
      
      // Assuming there's a function in stakholderService to get stakeholders by project ID
      const Racis = await raciService.getRacisByProjectId(projectId);
      
      res.status(httpStatus.OK).send(Racis);
    } catch (error) {
      console.error(error);
      res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
    }
  });

module.exports = {
    createRaci,
    getRacis,
    getRacisById,
    deleteRaciById,
    updateRaciById,
    getRacisByProjectId
}