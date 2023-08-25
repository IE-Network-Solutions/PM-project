const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { weeklyReportService, milestoneService, baselineService, taskService, projectService } = require('../services')

const getWeeklyReportByProjectByDate = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query
    const projectId = req.params.projectId;
    const result = await weeklyReportService.getWeeklyReportByProjectByDate(projectId, ["Open", "Closed"], startDate, endDate);
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});

module.exports = {
    getWeeklyReportByProjectByDate,
};
