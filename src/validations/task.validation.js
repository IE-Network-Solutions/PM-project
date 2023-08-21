const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    name: Joi.string(),
    plannedStart: Joi.date(),
    plannedFinish: Joi.date(),
    actualStart: Joi.date(),
    actualFinish: Joi.number(),
    plannedCost: Joi.number(),
    actualCost: Joi.number(),
    status: Joi.string(),
    sleepingReason: Joi.string(),
    milestoneId: Joi.required(),
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
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      userIds: Joi.array().items(Joi.string().guid()).required(),
    })
    .min(1),
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  assignResource,
};
