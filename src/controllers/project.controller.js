const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService} = require('../services');



// const createProject = catchAsync(async (req, res) => {
// const project = await projectService.createProject(req.body);
// res.status(httpStatus.CREATED).send(project);
// });

// project.controller.js
const createProject = catchAsync(async (req, res) => {
  const projectMembers = req.body.projectMembers; // Extract project members from the request body
  delete req.body.projectMembers; // Remove project members from the project object
  const project = await projectService.createProject(req.body, projectMembers);
  res.status(httpStatus.CREATED).json(project);
});


const getProjects = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['milestone']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.getProjects(filter, options);
  res.send(result);
});

const getProject = catchAsync(async(req, res)=>{
  const project = await projectService.getProject(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});
const updateProject = catchAsync(async(req, res)=>{
  const project = await projectService.updateProject(req.params.projectId, req.body);
  res.send(project);
});
const deleteProject = catchAsync(async(req, res)=>{
  await projectService.deleteProject(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
