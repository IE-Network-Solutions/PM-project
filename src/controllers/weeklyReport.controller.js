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




module.exports = {
  weeklyReport,
  addSleepingReason,
  allTasks,
  addWeeklyReport,
  getAddedWeeklyReport
};
