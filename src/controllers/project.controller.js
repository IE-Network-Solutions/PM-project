const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService, currencyService} = require('../services');
const { User } = require('../models');

const createProject = catchAsync(async (req, res) => {
  const projectMembers = req.body.projectMembers;
  const projectContractValueData = req.body.projectContractValue;
  const projectContractValue = [];
  for (const data of projectContractValueData) {
    const currency = await currencyService.getCurrencyById(data.currency);
    const contractValueData = {
      amount: data.amount,
      currency: currency
    }
    projectContractValue.push(contractValueData);
  }
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

const addMember = catchAsync(async (req, res) => {
  const projectMember = await projectService.addMember(req.params.projectId, req.body);
  res.status(httpStatus.CREATED).json(projectMember);
});

const removeMember = catchAsync(async (req, res) => {
  const projectId = await projectService.removeMember(req.params.projectId, req.body);
  res.send(projectId);
});

const getAllProjectTasksVarianceByProject = async (req, res) => {
  const projectIds = await projectService.getAllProjectTasksVarianceByProject();
  res.send(projectIds);
}

const getAllProjectsDetailOnMasterSchedule = async (req, res) => {
  const projectDetail = await projectService.getAllProjectsDetailOnMasterSchedule();
  res.send(projectDetail);
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getAllProjectTasksVarianceByProject,
  getAllProjectsDetailOnMasterSchedule,
  addMember,
  removeMember
};
