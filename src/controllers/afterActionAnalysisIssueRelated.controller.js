const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { afterActionAnalysisIssueRelatedService } = require('../services');

const createAfterActionAnalysisIssueRelated = catchAsync(async (req, res) => {
    const afterActionAnalysisId = req.params.actionAnalysisActionId;
    const actionsId = req.body.actionToBeTakenId;
    console.log("actions", actionsId, "after action analysis", afterActionAnalysisId)

    const result = await afterActionAnalysisIssueRelatedService.createAfterActionAnalysisAction(afterActionAnalysisId, actionsId);
    console.log(result)
    res.status(httpStatus.CREATED).send(result);
});

const getafterActionAnalysisWithIssueRelated = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await afterActionAnalysisIssueRelatedService.queryActionAnalysisWithIssueRelated(filter, options);
    res.send(result);
});

const getafterActionAnalysisWithIssueRelatedById = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await afterActionAnalysisIssueRelatedService.queryActionAnalysisWithActionToBeTakenById(filter, options);
    res.send(result);
});
module.exports = {
    createAfterActionAnalysisIssueRelated,
    getafterActionAnalysisWithIssueRelated,
    getafterActionAnalysisWithIssueRelatedById
};
