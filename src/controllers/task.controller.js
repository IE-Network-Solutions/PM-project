const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService, userService, projectService } = require('../services');

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.getTasks(filter, options);
  res.send(result);
});

const extendTasks = catchAsync(async (req, res) => {
  console.log(req.params.baselineId, 'baseline id');
  const extendTasks = await taskService.extendTasks(req.params.baselineId);
  res.send(extendTasks);
});


const getTasksByMileston = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const task = await taskService.getTasksByMileston(req.params.milestoneId, filter, options);
  res.send(task);
});



const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTask(req.params.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  res.send(task);
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.taskId, req.body);
  res.send(task);
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.taskId);
  res.status(httpStatus.NO_CONTENT).send();
});

const assignResource = catchAsync(async (req, res) => {
  const taskId = req.body.taskId;
  const userIds = req.body.userIds;
  const assinedUsers = await taskService.assignResource(taskId, userIds);
  res.send(assinedUsers);
});

const assignAllResource = catchAsync(async (req, res) => {
  console.log(req.body);
  const assinedUsers = await taskService.assignAllResource(req.body);
  res.send(assinedUsers);
});

const removeResource = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  const userId = req.body.userId;
  const task = await taskService.getTask(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const removeUser = await taskService.removeResource(taskId, userId);
  res.send(removeUser);
});

const getTasksByPlandStartDate = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const project = await projectService.getProject(req.body.projectId);
  if (!project) {
    throw ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const tasks = await taskService.filterTaskByPlanedDate(projectId, startDate, endDate);
  res.send(tasks);
});

module.exports = {
  createTask,
  getTasks,
  extendTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByMileston,
  assignResource,
  removeResource,
  getTasksByPlandStartDate,
  assignAllResource,
};
