const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { milestoneService} = require('../services');

const createMilestone = catchAsync(async (req, res) => {
const project = await milestoneService.createMilestone(req.body);
res.status(httpStatus.CREATED).send(project);
});

const getMilestones = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await milestoneService.getMilestones(filter, options);
  res.send(result);
});

const getMilestone = catchAsync(async(req, res)=>{
  const milestone = await milestoneService.getMilestone(req.params.milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }
  res.send(milestone);
});
const updateMilestone = catchAsync(async(req, res)=>{
  const milestone = await milestoneService.updateMilestone(req.params.milestoneId, req.body);
  res.send(milestone);
});
const deleteMilestone = catchAsync(async(req, res)=>{
    await milestoneService.deleteMilestone(req.params.milestoneId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMilestone,
  getMilestones,
  getMilestone,
  updateMilestone,
  deleteMilestone,
};
