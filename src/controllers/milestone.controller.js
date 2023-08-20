const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { milestoneService, projectService} = require('../services');

const createMilestone = catchAsync(async (req, res) => {
  const milestone = await milestoneService.createMilestone(req.body);
  const Tasks = req.body.tasks;
  const subTasks = req.body.subtasks;
  delete req.body.Tasks;
  delete req.body.subTasks; 

  // relation with project
  const project = await projectService.getProject(req.body.projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  // milestone.project = project; // Associate the milestone with the project

  // Save the milestone with the associated project
  await milestoneService.createMilestone(req.body, Tasks, subTasks); // Replace with the appropriate method
  res.status(httpStatus.CREATED).json(milestone); // Send the milestone in the response
});



const getMilestones = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const milestone = await milestoneService.getMilestones(filter, options, relation, ["project"]);
  res.send(milestone);
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
