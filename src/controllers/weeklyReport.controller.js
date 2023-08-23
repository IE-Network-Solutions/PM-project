const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getWeeklyReportByDate = catchAsync(async (req, res) => {
    const projectId = req.params.projectId;
    console.log(req.query)
});

module.exports = {
    getWeeklyReportByDate,
};
