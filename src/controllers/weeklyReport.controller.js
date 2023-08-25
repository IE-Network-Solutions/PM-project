const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {weeklyReportService} = require('../services');


const weeklyReport = catchAsync(async (req, res) => {
  const project = await weeklyReportService.weeklyReport(req.params.projectId);
  res.send(project);
});

module.exports = {
  weeklyReport
};
