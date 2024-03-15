const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lessonLearnedService } = require('../services');
/**
 * @module lessonLearned
 */
/**
 * Creates a lesson learned.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created lesson learned.
 */
const createLL = catchAsync(async (req, res) => {
    req.body.date = new Date().toString();
    const result = await lessonLearnedService.createLL(req.body);
    res.status(httpStatus.CREATED).send(result);
});
/**
 * Retrieves all lesson learneds based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all retrieved lesson learneds.
 */
const getLLs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await lessonLearnedService.queryLLs(filter, options);
    res.send(result);
});
/**
 * Retrieves all lesson learneds associated with a specific project ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all lesson learneds associated with the specified project ID.
 * @throws {ApiError} If no lesson learneds are found for the provided project ID.
 */
const getAllLLByProjectId = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByProjectId(req.params.projectId);
    console.log("result", result[0])
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id is not found');
    }
    res.send(result);
});
/**
 * Retrieves all lesson learneds associated with a specific department ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all lesson learneds associated with the specified department ID.
 * @throws {ApiError} If no lesson learneds are found for the provided department ID.
 */
const getAllLLByDepartmentId = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByDepartmentId(req.params.departmentId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Department id is not found');
    }
    res.send(result);
});
/**
 * Retrieves a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the lesson learned corresponding to the provided ID.
 * @throws {ApiError} If the lesson learned with the provided ID is not found.
 */
const getLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getLLById(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});
/**
 * Groups lesson learneds by project and returns the result.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the grouped lesson learneds by project.
 * @throws {ApiError} If no lesson learneds are found.
 */
const groupLLByProject = catchAsync(async (req, res) => {
    const LL = await lessonLearnedService.groupLLByProject();
    if (!LL) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL not found');
    }
    res.status(200).json({
        status: "Success",
        data: LL
    });
});
/**
 * Updates a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated lesson learned.
 */
const updateLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.updateLLById(req.params.LLId, req.body);
    res.send(result);
});
/**
 * Deletes a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the lesson learned.
 */
const deleteLLById = catchAsync(async (req, res) => {
    await lessonLearnedService.deleteLLById(req.params.LLId);
    res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
    createLL,
    getLLs,
    getAllLLByProjectId,
    getAllLLByDepartmentId,
    getLLById,
    updateLLById,
    deleteLLById,
    groupLLByProject
};
