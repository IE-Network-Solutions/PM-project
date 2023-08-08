const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { riskService } = require('../services');
const { riskImpactkMatrixRules } = require('../utils/riskMatrix');
const { residualRiskResidualImpactMatrixRules } = require('../utils/riskMatrix');

const createRisk = catchAsync(async (req, res) => {
    const { impact, probability, residualImpact, residualProbability } = req.body;

    const riskRate = riskImpactkMatrixRules.find(rules => rules.impact === impact && rules.probability === probability);
    req.body.riskRate = riskRate.rating;

    const residualRiskRate = residualRiskResidualImpactMatrixRules.find(rules => rules.residualImpact === residualImpact && rules.residualProbability === residualProbability);
    req.body.residualRiskRate = residualRiskRate.rating;

    const risk = await riskService.createRisk(req.body);
    res.status(httpStatus.CREATED).send(risk);
});

const getRisks = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await riskService.queryRisks(filter, options);
    res.send(result);
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
    updateRisk,
    deleteRisk
};
