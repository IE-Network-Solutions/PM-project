const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { baselineService } = require('../services');

const createBaseline = catchAsync(async (req, res) => {
  console.log("savedtasknhnh")
  const milestones = req.body.milestones;
  // const subTasks = req.body.subTasks;
  delete req.body.milestones;
  // delete req.body.subTasks;
  const baseline = await baselineService.createBaseline(req.body, milestones);

  res.status(httpStatus.CREATED).json(baseline);
});

const getBaselines = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const baseline = await baselineService.getBaselines(filter, options);
  res.send(baseline);
});

const getBaseline = catchAsync(async (req, res) => {
  const baseline = await baselineService.getBaseline(req.params.baselineId);
  console.log("testttttt selam")
  if (!baseline) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Baseline not found');
  }
  res.send(baseline);
});

const getByMilestone = catchAsync(async (req, res) => {
  const milestoneBaseline = await baselineService.getByMilestone(req.params.milestoneId);
  res.send(milestoneBaseline);
});

const updateBaseline = catchAsync(async (req, res) => {
  const baseline = await baselineService.updateBaseline(req.params.baselineId, req.body, req.body.tasks);
  delete req.body.tasks;
  res.send(baseline);
});
const deleteBaseline = catchAsync(async (req, res) => {
  await baselineService.deleteBaseline(req.params.baselineId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addComment = catchAsync(async (req, res) => {
  const baselineComment = await baselineService.addComment(req.body);
  res.status(httpStatus.CREATED).send(baselineComment);
});

const getComments = catchAsync(async (req, res) => {
  const baselineComment = await baselineService.getComments(req.params.baselineId);
  res.send(baselineComment);
});

const masterSchedule = catchAsync(async (req, res) => {
  const masterSchedule = await baselineService.masterSchedule();
  res.send(masterSchedule);
});

const masterScheduleByDateFilter = catchAsync(async (req, res) => {
  const masterSchedule = await baselineService.masterScheduleByDateFilter(req.query.startDate, req.query.finsihDate);
  res.send(masterSchedule);
});


const projectSchedule = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const projectSchedule = await baselineService.projectSchedule(projectId);
  res.send(projectSchedule);
});

const activeProjectSchedule = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const projectSchedule = await baselineService.activeProjectSchedule(projectId);
  res.send(projectSchedule);
});

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
  addComment,
  getComments,
  masterSchedule,
  projectSchedule,
  activeProjectSchedule,
  masterScheduleByDateFilter
};

