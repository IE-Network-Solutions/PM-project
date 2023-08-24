const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { weeklyReportService } = require('../services')

const getWeeklyReportByProjectByDate = catchAsync(async (req, res) => {

    const { startDate, endDate } = req.query
    const projectId = req.params.projectId;

    const result = await weeklyReportService.getWeeklyReportByProjectByDate(projectId, startDate, endDate);
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});

module.exports = {
    getWeeklyReportByProjectByDate,
};
