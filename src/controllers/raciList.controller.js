const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { raciListService} = require('../services');

const createRaciList = catchAsync(async (req, res) => {
  try {
    // Assuming stakholderService.createStakHolder accepts project ID and stakholder data
    const raciList = await raciListService.createRaciList(req.body);
    // Include other fields here

    res.status(httpStatus.CREATED).send(raciList);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
  }
});

const getRaciLists= catchAsync(async(req, res) => {
  const raciLists =await raciListService.getRaciLists();
  res.status(httpStatus.OK).send(raciLists);
})
module.exports = {
    createRaciList,
    getRaciLists,
   
}