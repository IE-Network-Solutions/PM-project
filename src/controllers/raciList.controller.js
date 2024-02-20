const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { raciListService} = require('../services');
/**
 * @module raciList
 */

/**
 * Creates a RACI list.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the RACI list is created.
 * @throws {Error} - If there's an issue with creating the RACI list.
 */
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
/**
 * Retrieves all RACI lists.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the RACI lists are retrieved.
 * @throws {Error} - If there's an issue fetching the RACI lists.
 */
const getRaciLists= catchAsync(async(req, res) => {
  const raciLists =await raciListService.getRaciLists();
  res.status(httpStatus.OK).send(raciLists);
})
module.exports = {
    createRaciList,
    getRaciLists,

}
