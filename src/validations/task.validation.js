const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    name: Joi.string(),
    plannedStart: Joi.date(),
    plannedFinish: Joi.date(),
    actualStart: Joi.date(),
    actualFinish: Joi.date(),
    plannedCost: Joi.number(),
    actualCost: Joi.number(),
    status: Joi.string(),
    sleepingReason: Joi.string(),
    milestoneId: Joi.required(),
    completion: Joi.number(),
  }),
};

const getTasks = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
};

const assignResource = {
  body: Joi.object()
    .keys({
      taskId: Joi.string().guid().required(),
      userIds: Joi.array().items(Joi.string().guid()).required(),
    })
    .min(1),
};

const assignResourceSchema = Joi.object({
  taskId: Joi.string().guid().required(),
  userIds: Joi.array().items(Joi.string()).required(),
});

const assignAllResource = {
  body: Joi.object().keys({
    resources: Joi.array().items(assignResourceSchema).required(),
  }),
};

const removeResource = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().guid().required(),
  }),
};
const getByPlnedDate = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
  query: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  assignResource,
  removeResource,
  getByPlnedDate,
  assignAllResource,
};
