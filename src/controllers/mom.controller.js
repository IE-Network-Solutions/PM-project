const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { momService } = require('../services');
const { momComment } = require('../models');
/**
 * @module MOM
 */
/**
 * Creates a new meeting minutes (MOM).
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created meeting minutes.
 * @throws {ApiError} - Throws an error if the MOM cannot be created.
 */
const createMom = catchAsync(async (req, res) => {
  const Attendees = req.body.attendees;
  const Absents = req.body.absents
  const Agenda = req.body.agenda;
  const Action = req.body.action;
  delete req.body.attendees;
  delete req.body.action;
  delete req.body.agenda;
  const mom = await momService.createMom(req.body, Attendees, Absents, Action, Agenda);
  res.status(httpStatus.CREATED).json(mom);
});

/**
 * Retrieves all meeting minutes (MOMs).
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of MOMs.
 * @throws {ApiError} - Throws an error if no MOMs are found.
 */
const getMoms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const mom = await momService.getMoms(filter, options)
  res.send(mom);
});

/**
 * Retrieves a specific meeting minutes (MOM) by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested MOM.
 * @throws {ApiError} - Throws an error if the MOM is not found.
 */
const getMom = catchAsync(async (req, res) => {
  const mom = await momService.getMom(req.params.momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  res.send(mom);
});

/**
 * Retrieves meeting minutes (MOMs) associated with a specific project.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the MOMs for the specified project.
 */
const getByProject = catchAsync(async (req, res) => {
  const projectMom = await momService.getByProject(req.params.projectId);
  res.send(projectMom);
});

/**
 * Groups meeting minutes (MOMs) by project.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a list of projects and their associated MOMs.
 */
const groupMOMByProject = catchAsync(async (req, res) => {
  const MOM = await momService.groupMOMByProject();
  if (!MOM) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MOM not found');
  }
  res.status(200).json({
    status: "Success",
    data: MOM
  });
});

/**
 * Updates meeting minutes (MOM) by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated MOM.
 */
const updateMom = catchAsync(async (req, res) => {
  const attendees = req.body.momAttendees;
  const absents = req.body.momAbsents;
  const action = req.body.momAction;
  const agenda = req.body.momAgenda;

  delete req.body.momAttendees;
  delete req.body.momAction;
  delete req.body.momAgenda;
  delete req.body.momComment;
  delete req.body.momAbsents


  const momBody = req.body;

  const mom = await momService.updateMom(req.params.momId, momBody, attendees, absents, action, agenda);
  res.send(mom);
});

/**
 * Deletes meeting minutes (MOM) by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after deletion.
 */
const deleteMom = catchAsync(async (req, res) => {
  console.log(req.params.momId, 'llll')
  await momService.deleteMom(req.params.momId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Adds a new comment to the meeting minutes (MOM).
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created comment.
 */
const addComment = catchAsync(async (req, res) => {
  const momComment = await momService.addComment(req.body);
  res.status(httpStatus.CREATED).send(momComment);
});

/**
 * Retrieves comments associated with a specific meeting minutes (MOM) by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of comments for the specified MOM.
 */
const getComments = catchAsync(async (req, res) => {
  const momComment = await momService.getComments(req.params.momId);
  res.send(momComment);
});

module.exports = {
  createMom,
  getMoms,
  getMom,
  getByProject,
  updateMom,
  deleteMom,
  addComment,
  getComments,
  groupMOMByProject
};
