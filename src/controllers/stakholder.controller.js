const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { stakholderService} = require('../services');
/**
 * @module Stakholder
 */
/**
 * Creates a stakeholder record.
 * @function
 * @param {Object} req.body - The request body containing stakeholder data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stakeholder record is created.
 * @throws {Error} - If there's an issue with creating the stakeholder record.
 */
const createStakHolder = catchAsync(async (req, res) => {
  try {
    // Assuming stakholderService.createStakHolder accepts project ID and stakholder data
    const stakholder = await stakholderService.createStakHolder(req.body);
    // Include other fields here

    res.status(httpStatus.CREATED).send(stakholder);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
  }
});

/**
 * Retrieves all stakeholder records.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stakeholder records are retrieved.
 * @throws {Error} - If there's an issue fetching the stakeholder records.
 */
const getStakHolders = catchAsync(async (req, res) => {
    const stakholders = await stakholderService.getStakHolders(); // Assuming there is a function in stakholderService to retrieve all stakeholders
    res.status(httpStatus.OK).send(stakholders);
});

/**
 * Retrieves a specific stakeholder record by its ID.
 * @function
 * @param {Object} req.params.stakholderId - The ID of the stakeholder record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stakeholder record is retrieved.
 * @throws {Error} - If the stakeholder record is not found.
 */
const getStakHoldersById = catchAsync(async (req, res) => {
    const stakholderId = req.params.stakholderId;
    const stakholder = await stakholderService.getStakHoldersById(stakholderId);

    if (!stakholder) {
        return res.status(httpStatus.NOT_FOUND).send({ error: 'Stakholder not found' });
    }

    res.status(httpStatus.OK).send(stakholder);
});


// const deleteStakHoldersById = async (stakholderId) => {
//     const stakholder = await stakholderService.getStakHoldersById(stakholderId);

//     if (!stakholder) {
//         return null; // or throw an error, depending on your use case
//     }
//     stakholder.isDeleted = true;
//     return await stakholderService.save(stakholder);
// };
/**
 * Deletes a specific stakeholder record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the stakeholder record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stakeholder record is deleted.
 * @throws {Error} - If there's an issue with deleting the stakeholder record.
 */
const deleteStakHoldersById = catchAsync(async (req, res) => {
    try {
      const stakholderId = req.params.id; // Assuming the ID is in the request parameters
      await stakholderService.deleteStakHoldersById(stakholderId);
      res.status(httpStatus.NO_CONTENT).send(); // No content to send on successful deletion
    } catch (error) {
      // Handle errors appropriately, e.g., return a 404 status if the stakholder is not found
      console.error(error);
      res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
    }
  });
/**
 * Updates a specific stakeholder record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the stakeholder record.
 * @param {Object} req.body - The updated stakeholder data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stakeholder record is updated.
 * @throws {Error} - If there's an issue with updating the stakeholder record.
 */
  const updateStakHoldersById = catchAsync(async (req, res) => {
    try {
      const stakholderId = req.params.id;
      const updatedStakholder = await stakholderService.updateStakHoldersById(stakholderId, req.body);

      if (!updatedStakholder) {
        // Handle case where the stakholder is not found
        return res.status(httpStatus.NOT_FOUND).send({ error: 'Stakholder not found' });
      }

      res.status(httpStatus.OK).send(updatedStakholder);
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
    }
  });
/**
 * Retrieves stakeholder records associated with a specific project.
 * @function
 * @param {Object} req.params.project_id - The ID of the project.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stakeholder records are retrieved.
 * @throws {Error} - If there's an issue fetching the stakeholder records.
 */
  const getStakHoldersByProject_Id = catchAsync(async (req, res) => {
    try {
      const projectId = req.params.project_id;

      // Assuming there's a function in stakholderService to get stakeholders by project ID
      const stakeholders = await stakholderService.getStakHoldersByProjectId(projectId);

      res.status(httpStatus.OK).send(stakeholders);
    } catch (error) {
      console.error(error);
      res.status(httpStatus.BAD_REQUEST).send({ error: error.message });
    }
  });
module.exports = {
    createStakHolder,
    getStakHolders,
    getStakHoldersById,
    deleteStakHoldersById,
    updateStakHoldersById,
    getStakHoldersByProject_Id

  };
