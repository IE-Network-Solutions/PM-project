const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { riskService, issueService } = require('../services');
const { residualMapRiskRate } = require('../utils/riskMatrix');
const { mapRiskRate } = require('././../utils/riskMatrix');

const createRisk = catchAsync(async (req, res) => {
    const { impact, probability, residualImpact, residualProbability } = req.body;

    // const riskRate = riskImpactkMatrixRules.find(rules => rules.impact === impact && rules.probability === probability);
    // req.body.riskRate = riskRate.rating;

    // const residualRiskRate = residualRiskResidualImpactMatrixRules.find(rules => rules.residualImpact === residualImpact && rules.residualProbability === residualProbability);
    // req.body.residualRiskRate = residualRiskRate.rating;
    req.body.riskRate = mapRiskRate(impact, probability);
    req.body.residualRiskRate = residualMapRiskRate(residualImpact, residualProbability);
    const risk = await riskService.createRisk(req.body);
    res.status(httpStatus.CREATED).send(risk);
});

const getRisks = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await riskService.queryRisks(filter, options);
    res.send(result);
});

const getRisksByDate = catchAsync(async (req, res) => {

    const { startDate, endDate } = req.query
    console.log("start date :", startDate, "endDate", endDate)
    const dates = await riskService.getRisksByDate(startDate, endDate);

    console.log("date list", dates)

    if (!dates) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.send(dates);
});

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

const getRisk = catchAsync(async (req, res) => {
    const risk = await riskService.getRiskById(req.params.riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.send(risk);
});

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

const getAllCriticalRisks = catchAsync(async (req, res) => {
    const result = await riskService.getAllCriticalRisks();
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk id not found');
    }
    res.send(result);
});



const updateRisk = catchAsync(async (req, res) => {
    const risk = await riskService.updateRiskById(req.params.riskId, req.body);
    res.send(risk);
});

const deleteRisk = catchAsync(async (req, res) => {
    await riskService.deleteRiskById(req.params.riskId);
    res.status(httpStatus.NO_CONTENT).send();
});

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
    groupCriticalRiskByProject

};
