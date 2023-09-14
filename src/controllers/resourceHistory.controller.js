const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { resourceHistory} = require('../services');

const createResourceHistory = catchAsync(async (req, res) => {
const resource = await resourceHistory.createResourceHistory(req.body);
res.status(httpStatus.CREATED).send(resource);
});



const getResourceHistoryByProjectId = catchAsync(async (req, res) => {
    const history = await resourceHistory.getResourceHistoryByProjectId(req.params.projectId);
    if (history.length==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(history);
});


const getResourceHistoryByTaskId = catchAsync(async (req, res) => {
    const history = await resourceHistory.getResourceHistoryByTaskId(req.params.taskId);
    if (history.length==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(history);
});

const getResourceHistoryByUserId = catchAsync(async (req, res) => {
    const history = await resourceHistory.getResourceHistoryByUserId(req.params.userId);
    
    if (history.length==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(history);
});
const getAllResourceHistory = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await resourceHistory.getAllResourceHistory(filter, options);
    res.send(result);
});

module.exports = {
    createResourceHistory,
    getResourceHistoryByProjectId,
    getResourceHistoryByTaskId,
    getResourceHistoryByUserId,
    getAllResourceHistory
  };