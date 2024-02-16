const catchAsync = require("../utils/catchAsync");
const { milestoneService, projectService } = require('../services');
const httpStatus = require('http-status');

/**
 * @module quality
 */
/**
 * Creates a quality record.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the quality record is created.
 * @throws {Error} - If there's an issue with creating the quality record.
 */
const createQuality = catchAsync(async (req, res, next) => {

});

/**
 * Retrieves project data for quality checking.
 * @function
 * @param {Object} req.params.id - The ID of the project.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the project data is retrieved.
 * @throws {Error} - If there's an issue fetching the project data.
 */
const getProjectByIdForQualityChecking = catchAsync(async (req, res, next) => {
    const project = await projectService.getProject(req.params.id);
    const milestones = await milestoneService.getByProject(req.params.id);
    const closedMilestones = milestones.filter((milestone) => (milestone.status === true))
    project.milestone = closedMilestones;
    res.status(httpStatus.CREATED).send(project);
});

module.exports = {
    getProjectByIdForQualityChecking,
    createQuality
}
