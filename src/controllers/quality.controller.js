const catchAsync = require("../utils/catchAsync");
const { milestoneService, projectService } = require('../services');
const httpStatus = require('http-status');

const createQuality = catchAsync(async (req, res, next) => {

});

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