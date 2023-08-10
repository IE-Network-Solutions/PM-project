const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { riskService } = require('../services');
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

const getRiskByDate = catchAsync(async (req, res) => {

    const startDate = new Date(req.body.startDate); 
    const endDate = new Date(req.body.endDate);
    const risk = await riskService.getRiskByDate(startDate, endDate);

    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.send(risk);
});

const getRisk = catchAsync(async (req, res) => {
    const risk = await riskService.getRiskById(req.params.riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    res.send(risk);
});

const updateRisk = catchAsync(async (req, res) => {
    const risk = await riskService.updateRiskById(req.params.riskId, req.body);
    res.send(risk);
});

const deleteRisk = catchAsync(async (req, res) => {
    await riskService.deleteRiskById(req.params.riskId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createRisk,
    getRisks,
    getRisk,
    getRiskByDate,
    updateRisk,
    deleteRisk
};
