const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {weeklyReportService} = require('../services');


const allTasks = catchAsync(async (req, res) => {
  const project = await weeklyReportService.allActiveBaselineTasks(req.params.projectId);
  res.send(project);
});

const weeklyReport = catchAsync(async (req, res) => {
  const project = await weeklyReportService.getWeeklyReport(req.params.projectId);
  res.send(project);
});

const addSleepingReason = catchAsync(async (req, res) => {
  const updatedTasks = await weeklyReportService.addSleepingReason(req.body);
  res.send(updatedTasks);
});

const addWeeklyReport = catchAsync(async(req, res)=>{
   const weeklyReport = await weeklyReportService.addWeeklyReport(req.params.projectId, req.body);
   res.status(httpStatus.CREATED).send(weeklyReport);
});


const getAddedWeeklyReport = catchAsync(async(req, res)=>{
  const savedWeeklyReport = await weeklyReportService.getAddedWeeklyReport(req.params.projectId);
  res.send(savedWeeklyReport);
});

const getReportByWeek = catchAsync(async(req, res)=>{
  const reportByWeek = await weeklyReportService.getReportByWeek(req.params.projectId, req.params.week);
  res.send(reportByWeek);
});

const addComment = catchAsync(async(req, res) =>{
  const weeklyReportComment = await weeklyReportService.addComment(req.body);
  res.status(httpStatus.CREATED).send(weeklyReportComment);
});

const getComments = catchAsync(async (req, res)=>{
  const weeklyReportComment = await weeklyReportService.getComments(req.params.weeklyReportId);
  res.send(weeklyReportComment);
});




module.exports = {
  weeklyReport,
  addSleepingReason,
  allTasks,
  addWeeklyReport,
  getAddedWeeklyReport,
  getReportByWeek,
  addComment,
  getComments
};
