const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService, currencyService } = require('../services');
const { User } = require('../models');
/**
 * @module project
 */
/**
 * Creates a new project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created project.
 */
const createProject = catchAsync(async (req, res) => {
  const projectMembers = req.body.projectMembers;
  let projectContractValue = [];

  if (req.body.projectContractValue) {
    const projectContractValueData = req.body.projectContractValue;
    for (const data of projectContractValueData) {
      const currency = await currencyService.getCurrencyById(data.currency);
      const contractValueData = {
        amount: data.amount,
        currency: currency,
      };
      projectContractValue.push(contractValueData);
    }
  }

  delete req.body.projectMembers;
  delete req.body.projectContractValue;

  const project = await projectService.createProject(req.body, projectMembers, projectContractValue);
  res.status(httpStatus.CREATED).json(project);
});
/**
 * Retrieves projects based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved projects.
 */
const getProjects = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['milestone']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.getProjects(filter, options);
  res.send(result);
});
/**
 * Retrieves a project by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the project corresponding to the provided ID.
 * @throws {ApiError} If the project with the provided ID is not found.
 */
const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProject(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});
/**
 * Updates a project by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated project.
 */
const updateProject = catchAsync(async (req, res) => {

  const project = await projectService.updateProject(req.params.projectId, req.body);
  res.send(project);
});
const updateProjectFomSchedule = catchAsync(async (req, res) => {

  const project = await projectService.updateProject(req.params.projectId, req.body);
  res.send(project);
});
/**
 * Deletes a project by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the project.
 */

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Adds a member to a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated project containing the added member.
 */
const addMember = catchAsync(async (req, res) => {

  const projectMember = await projectService.addMember(req.params.projectId, req.body);
  res.status(httpStatus.CREATED).json(projectMember);
});
/**
 * Removes a member from a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated project containing the removed member.
 */
const removeMember = catchAsync(async (req, res) => {
  const projectId = await projectService.removeMember(req.params.projectId, req.body);
  res.send(projectId);
});
/**
 * Retrieves all project tasks variance by project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all project tasks variance.
 */
const getAllProjectTasksVarianceByProject = async (req, res) => {
  const projectIds = await projectService.getAllProjectTasksVarianceByProject();
  res.send(projectIds);
};
/**
 * Retrieves all project details on the master schedule.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all project details on the master schedule.
 */
const getAllProjectsDetailOnMasterSchedule = async (req, res) => {
  const projectDetail = await projectService.getAllProjectsDetailOnMasterSchedule();
  res.send(projectDetail);
};

/**
 * Closes a project by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the closed project.
 */
const closeProject = catchAsync(async (req, res) => {
  const project = await projectService.closeProject(req.params.projectId, req.body);
  res.send(project);
});
/**
 * Retrieves the total number of active and closed projects based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the total number of active and closed projects.
 */
const getTotalActiveClosedProjects = async (req, res) => {
  const filter = pick(req.query, ['milestone']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const totalProjects = await projectService.getTotalActiveClosedProjects(filter, options);
  res.send(totalProjects);
};
/**
 * Retrieves project members by project ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the project members.
 */
const getProjectMemebres = async (req, res) => {
  const projectMemebers = await projectService.getMembers(req.params.projectId);
  res.status(200).send(projectMemebers);
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getAllProjectTasksVarianceByProject,
  getAllProjectsDetailOnMasterSchedule,
  addMember,
  removeMember,
  getTotalActiveClosedProjects,
  closeProject,
  getProjectMemebres,
  updateProjectFomSchedule
};
