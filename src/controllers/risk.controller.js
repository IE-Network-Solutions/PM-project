const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { riskService, issueService, projectService } = require('../services');
const { residualMapRiskRate } = require('../utils/riskMatrix');
const { mapRiskRate } = require('././../utils/riskMatrix');
/**
 * @module risk
 */
/**
 * Creates a new risk.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created risk.
 */
const createRisk = catchAsync(async (req, res) => {

    const { impact, probability, residualImpact, residualProbability } = req.body;
    req.body.riskRate = mapRiskRate(impact, probability);
    req.body.residualRiskRate = residualMapRiskRate(residualImpact, residualProbability);
    const risk = await riskService.createRisk(req.body);
    res.status(httpStatus.CREATED).send(risk);
});
/**
 * Retrieves risks based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved risks.
 */
const getRisks = catchAsync(async (req, res) => {

    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await riskService.queryRisks(filter, options);
    res.send(result);
});
/**
 * Retrieves risks within a date range specified by startDate and endDate.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved risks.
 * @throws {ApiError} If risks are not found within the specified date range.
 */
const getRisksByDate = catchAsync(async (req, res) => {

    const { startDate, endDate } = req.query
    console.log("start date :", startDate, "endDate", endDate)
    const dates = await riskService.getRisksByDate(startDate, endDate);
    if (!dates) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.send(dates);
});
/**
 * Retrieves all risks associated with a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved risks.
 * @throws {ApiError} If the project is not found.
 */
const getAllRisksByProjectId = catchAsync(async (req, res) => {

    const { startDate, endDate } = req.query
    const projectId = req.params.projectId;
    const project = projectService.getProject(projectId)
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    const result = await riskService.getAllRisksByProjectId(projectId);

    res.send(result);
});
/**
 * Retrieves all risks associated with a project within a date range specified by startDate and endDate.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved risks.
 * @throws {ApiError} If the project is not found.
 */
const getAllRisksByProjectIdAndByDate = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query
    const projectId = req.params.projectId;
    const result = await riskService.getAllRisksByProjectIdAndByDate(projectId, ["Open", "Closed"], startDate, endDate);
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});
/**
 * Retrieves a risk by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved risk.
 * @throws {ApiError} If the risk with the provided ID is not found.
 */
const getRisk = catchAsync(async (req, res) => {

    const risk = await riskService.getRiskById(req.params.riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.send(risk);
});
/**
 * Groups critical risks by project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the grouped critical risks.
 * @throws {ApiError} If critical risks are not found.
 */
const groupCriticalRiskByProject = catchAsync(async (req, res) => {

    const criticalRisks = await riskService.groupCriticalRiskByProject();
    if (!criticalRisks) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.status(200).json({
        status: "Success",
        data: criticalRisks
    });
});
/**
 * Retrieves all critical risks.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all critical risks.
 * @throws {ApiError} If critical risks are not found.
 */
const getAllCriticalRisks = catchAsync(async (req, res) => {

    const result = await riskService.getAllCriticalRisks();
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk id not found');
    }
    res.send(result);
});


const getAllOpenRisksByProject = catchAsync(async (req, res) => {
    const result = await riskService.getAllOpenRisksByProject();
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk id not found');
    }
    res.send(result);
});
/**
 * Updates a risk by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated risk.
 */
const updateRisk = catchAsync(async (req, res) => {
    const { impact, probability, residualImpact, residualProbability } = req.body;
    req.body.riskRate = mapRiskRate(impact, probability);
    req.body.residualRiskRate = residualMapRiskRate(residualImpact, residualProbability);
    const risk = await riskService.updateRiskById(req.params.riskId, req.body);
    res.send(risk);
});
/**
 * Deletes a risk by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the risk.
 */
const deleteRisk = catchAsync(async (req, res) => {
    await riskService.deleteRiskById(req.params.riskId);
    res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Moves a risk to an issue by creating an issue with the risk details and updating the risk status.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after moving the risk to an issue.
 */
const moveRiskToIssue = catchAsync(async (req, res) => {
    const riskId = req.params.riskId;
    const result = await riskService.getRiskById(riskId);
    if (result.status === 'Closed') {
        throw new ApiError(httpStatus.NOT_FOUND, "Risk is Already Closed");
    }
    console.log(result);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Risk id is not found");
    }

    result.createdAt = new Date(); //create new timeStamp for the transfered Risks to Issue Pages
    await issueService.createIssue(result);
    const status = await riskService.updateRiskById(riskId, { status: "Transfered" });
    res.send(status)
});
/**
 * Retrieves all risks and issues associated with a project within a date range specified by startDate and endDate.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved risks and issues.
 */
const getAllRiskAndIssuesByProjectIdByDate = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query
    const result = await riskService.getAllRiskAndIssuesByProjectIdByDate(
        req.params.projectId, ["Open", "Closed"], startDate, endDate);
    res.send(result);
});

module.exports = {
    createRisk,
    getRisks,
    getRisk,
    getAllRisksByProjectIdAndByDate,
    getRisksByDate,
    updateRisk,
    deleteRisk,
    moveRiskToIssue,
    getAllCriticalRisks,
    getAllRiskAndIssuesByProjectIdByDate,
    getAllRisksByProjectId,
    groupCriticalRiskByProject,
    getAllOpenRisksByProject
};
