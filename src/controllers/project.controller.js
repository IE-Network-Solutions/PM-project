const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService} = require('../services');
const { User } = require('../models');

const createProject = catchAsync(async (req, res) => {
  const projectMembers = req.body.projectMembers;
  const projectContractValue = req.body.projectContractValue;
  delete req.body.projectMembers;
  delete req.body.projectContractValue;
  const project = await projectService.createProject(req.body, projectMembers, projectContractValue);
  res.status(httpStatus.CREATED).json(project);
});


const getProjects = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['milestone']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.getProjects(filter, options);
  res.send(result);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProject(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});
const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(req.params.projectId, req.body);
  res.send(project);
});
const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getProjectVariance = async (req, res) => {

  const taskList = await projectService.getProjectVariance(req.params.projectId);
  const task = taskList;
  console.log(taskList)
  const plannedStart1 = taskList.tasksForVariance[0].plannedStart;
  const actualStart1 = taskList.tasksForVariance[taskList.tasksForVariance.length - 1].actualStart;
  const startVariance = DateVariationOfStart(plannedStart1, actualStart1);

  const plannedFinish2 = taskList.tasksForVariance[0].plannedFinish;
  const actualFinish2 = taskList.tasksForVariance[taskList.tasksForVariance.length - 1].actualFinish;
  const finishVariance = DateVariationOfFinish(plannedFinish2, actualFinish2);

  const response = {
    startVariance: startVariance,
    finishVariance: finishVariance,
    project: taskList.tasksForVariance[0].baseline.milestone.project,
    task: task
  }

  res.send(response);
};

const DateVariationOfStart = (plannedStart, actualStart) => {
  const plannedStart1 = new Date(plannedStart);
  const actualStart1 = new Date(actualStart);
  const diffTime = actualStart1.getTime() - plannedStart1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
const DateVariationOfFinish = (plannedFinish, actualFinish) => {
  const plannedFinish1 = new Date(plannedFinish);
  const actualFinish1 = new Date(actualFinish);
  const diffTime = plannedFinish1.getTime() - actualFinish1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
const addMember = catchAsync(async (req, res) =>  {
  const projectMember = await projectService.addMember(req.params.projectId, req.body);
  res.status(httpStatus.CREATED).json(projectMember);
});

const removeMember =catchAsync(async(req, res)=>{
  const projectId = await projectService.removeMember(req.params.projectId, req.body);
  res.send(projectId);
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectVariance,
  addMember,
  removeMember
};
