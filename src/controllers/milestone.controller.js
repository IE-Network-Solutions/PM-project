const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { milestoneService, projectService } = require('../services');

const createMilestone = catchAsync(async (req, res) => {
  // const Tasks = req.body.tasks;
  // const subTasks = req.body.subTasks;
  // delete req.body.Tasks;
  // delete req.body.subTasks; 
  const milestone = await milestoneService.createMilestone(req.body);
  res.status(httpStatus.CREATED).json(milestone);
});



const getMilestones = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const milestone = await milestoneService.getMilestones(filter, options)
  res.send(milestone);
});

const getMilestone = catchAsync(async (req, res) => {
  const milestone = await milestoneService.getMilestone(req.params.milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }
  res.send(milestone);
});

const getByProject = catchAsync(async (req, res) => {
  const projectMilestone = await milestoneService.getByProject(req.params.projectId);
  res.send(projectMilestone);
});


const updateMilestone = catchAsync(async (req, res) => {
  const milestone = await milestoneService.updateMilestone(req.params.milestoneId, req.body);
  res.send(milestone);
});


const updateMilestoneVariance = catchAsync(async (req, res) => {
  const milestones = await Promise.all(req.body.map(async (element) => {
    const milestone = milestoneService.updateMilestone(element.id, element);
    return milestone;


  }));

  res.send(milestones);
});
const deleteMilestone = catchAsync(async (req, res) => {
  await milestoneService.deleteMilestone(req.params.milestoneId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMilestone,
  getMilestones,
  getByProject,
  getMilestone,
  updateMilestone,
  deleteMilestone,
  updateMilestoneVariance
};
