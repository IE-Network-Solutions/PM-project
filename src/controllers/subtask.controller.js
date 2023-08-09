const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subTaskService} = require('../services');

const createSubTask = catchAsync(async (req, res) => {
const subtask = await subTaskService.createSubTask(req.body);
res.status(httpStatus.CREATED).send(subtask);
});

const getSubTasks = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subTaskService.getSubTasks(filter, options);
  res.send(result);
});


const getSubTask = catchAsync(async(req, res)=>{
  const subtask = await subTaskService.getSubTask(req.params.subTaskId);
  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }
  res.send(subtask);
});

const updateSubTask = catchAsync(async(req, res)=>{
  const subtask = await subTaskService.updateSubTask(req.params.subTaskId, req.body);
  res.send(subtask);

});

const deleteSubTask = catchAsync(async(req, res)=>{
  await subTaskService.deleteSubTask(req.params.subTaskId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubTask,
  getSubTasks,
  getSubTask,
  updateSubTask,
  deleteSubTask,
};
