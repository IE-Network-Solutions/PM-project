const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService} = require('../services');

const createProject = catchAsync(async (req, res) => {
// 
const project = await projectService.createProject(req.body);

res.status(httpStatus.CREATED).send(project);
});

const getProjects = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['milestone']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.getProjects(filter, options);
  res.send(result);
});
const getProject = catchAsync(async(req, res)=>{
  const project = await projectService.getProject(req.params.postId);
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
  res.send("Routing for delete project working fine")
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
