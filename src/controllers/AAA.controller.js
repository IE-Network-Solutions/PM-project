const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const teamList = require('../utils/teamList');
const { AfterActionAnalysisService } = require('../services');
/**
 * @module AAA
 */
/**
 * Creates a new After Action Analysis (AAA) record.
 * @function
 * @param {Object} req - The request object containing the body with AAA data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the AAA record is created.
 */

const createAAA = catchAsync(async (req, res) => {
    const departments = req.body.departments;
    const AAA = await AfterActionAnalysisService.createAAA(req.body, departments);
    res.status(httpStatus.CREATED).send(AAA);
});
/**
 * Retrieves a list of After Action Analysis (AAA) records based on the provided filter and options.
 * @function
 * @param {Object} req - The request object containing the query parameters for filtering and pagination.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the queried AAA records.
 */

const getAAAs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await AfterActionAnalysisService.queryAAAs(filter, options);
    res.send(result);
});
/**
 * Retrieves an After Action Analysis (AAA) record by its ID.
 * @function
 * @param {Object} req - The request object containing the AAA ID in the parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved AAA record.
 */

const getAAA = catchAsync(async (req, res) => {
    const AAA = await AfterActionAnalysisService.getAAAById(req.params.AAAId);
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    res.status(200).json({
        status: "Success",
        data: AAA
    });
});
/**
 * Groups After Action Analysis (AAA) records by project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the grouped AAA records.
 */

const groupAAAByProject = catchAsync(async (req, res) => {
    const AAA = await AfterActionAnalysisService.groupAAAByProject();
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    res.status(200).json({
        status: "Success",
        data: AAA
    });
});
/**
 * Updates an After Action Analysis (AAA) record by its ID.
 * @function
 * @param {Object} req - The request object containing the AAA ID in the parameters and the updated AAA data in the body.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated AAA record.
 */

const updateAAAById = catchAsync(async (req, res) => {
    const AAA = await AfterActionAnalysisService.updateAAAById(req.params.AAAId, req.body);
    res.send(AAA);
});
/**
 * Deletes an After Action Analysis (AAA) record by its ID.
 * @function
 * @param {Object} req - The request object containing the AAA ID in the parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the AAA record is deleted.
 */

const deleteAAAById = catchAsync(async (req, res) => {
    await AfterActionAnalysisService.deleteAAAById(req.params.AAAId);
    res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Retrieves all After Action Analysis (AAA) records associated with a specific project ID.
 * @function
 * @param {Object} req - The request object containing the project ID in the parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the AAA records associated with the specified project ID.
 */

const getAllAAAByProjectId = catchAsync(async (req, res) => {
    const result = await AfterActionAnalysisService.getAllAAAByProjectId(req.params.projectId);
    if (!result) {
        throw new ApiError(httpStatus.NO_CONTENT, "Project id Not Found")
    }
    // console.log(result)
    // console.log(req.params.projectId)
    res.send(result)
});


module.exports = {
    createAAA,
    getAAAs,
    getAAA,
    updateAAAById,
    deleteAAAById,
    getAllAAAByProjectId,
    groupAAAByProject
};
