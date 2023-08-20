const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService} = require('../services');

const createTask = catchAsync(async (req, res) => {
  console.log(req.body);
// const task = await taskService.createTask(req.body);
// res.status(httpStatus.CREATED).send(task);
});

const getTasks = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.getTasks(filter, options);
  res.send(result);
});


const getTask = catchAsync(async(req, res)=>{
  const task = await taskService.getTask(req.params.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  res.send(task);
});

const updateTask = catchAsync(async(req, res)=>{
  const task = await taskService.updateTask(req.params.taskId, req.body);
  res.send(task);
});

const deleteTask = catchAsync(async(req, res)=>{
  await taskService.deleteTask(req.params.taskId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
