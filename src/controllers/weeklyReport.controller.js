const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getWeeklyReportByDate = catchAsync(async (req, res) => {
    res.send(req.query.startDate, " and ", req.query.endDate)
});

module.exports = {
    getWeeklyReportByDate,
};
