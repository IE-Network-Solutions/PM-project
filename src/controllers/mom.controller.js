const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { momService } = require('../services');
const { momComment } = require('../models');

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



const getMoms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const mom = await momService.getMoms(filter, options)
  res.send(mom);
});

const getMom = catchAsync(async (req, res) => {
  const mom = await momService.getMom(req.params.momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  res.send(mom);
});


const getByProject = catchAsync(async (req, res) => {
  const projectMom = await momService.getByProject(req.params.projectId);
  res.send(projectMom);
});

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

const updateMom = catchAsync(async (req, res) => {
  const attendees = req.body.attendees;
  const absents = req.body.absents;
  const externalAttendees = req.body.externalAttendees;
  const action = req.body.action;
  const agenda = req.body.agenda;

  delete req.body.attendees;
  delete req.body.action;
  delete req.body.agenda;

  const momBody = req.body;

  const mom = await momService.updateMom(req.params.momId, momBody, attendees, absents, externalAttendees, action, agenda);
  res.send(mom);
});


const deleteMom = catchAsync(async (req, res) => {
  await momService.deleteMom(req.params.momId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addComment = catchAsync(async (req, res) => {
  const momComment = await momService.addComment(req.body);
  res.status(httpStatus.CREATED).send(momComment);
});

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
