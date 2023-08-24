const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { momService} = require('../services');
const { momComment } = require('../models');

const createMom = catchAsync(async (req, res) => {
  const Attendees = req.body.attendees;
  const externalAttendees =  req.body.otherAttendees;
  const Agenda = req.body.agenda;
  const Action = req.body.action;
  delete req.body.attendees;
  delete req.body.action; 
  delete req.body.agenda; 
  const mom = await momService.createMom(req.body, Attendees,externalAttendees, Action, Agenda);
  res.status(httpStatus.CREATED).json(mom);
});



const getMoms = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const mom = await momService.getMoms(filter, options)
  res.send(mom);
});

const getMom = catchAsync(async(req, res)=>{
  const mom = await momService.getMom(req.params.momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  res.send(mom);
});


const getByProject = catchAsync(async(req, res)=>{
  const projectMom = await momService.getByProject(req.params.projectId);
  res.send(projectMom);
});


const updateMom = catchAsync(async(req, res)=>{
  const mom = await momService.updateMom(req.params.momId, req.body);
  res.send(mom);
});
const deleteMom = catchAsync(async(req, res)=>{
    await momService.deleteMom(req.params.momId);
    res.status(httpStatus.NO_CONTENT).send();
});

const addComment = catchAsync(async(req, res)=>{
  const momComment = await momService.addComment(req.body);
  res.status(httpStatus.CREATED).send(momComment);
});


module.exports = {
  createMom,
  getMoms,
  getMom,
  getByProject,
  updateMom,
  deleteMom,
  addComment
};
