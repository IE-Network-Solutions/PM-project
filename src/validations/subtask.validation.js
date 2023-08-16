const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubTask = {
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
  }),
};

const getSubTasks = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSubTask = {
  params: Joi.object().keys({
    subTaskId: Joi.string()
  }),
};

const updateSubTask = {
  params: Joi.object().keys({
    subTaskId: Joi.string()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteSubTask= {
    params: Joi.object().keys({
      subTaskId: Joi.string(),
    }),
  };

module.exports = {
  createSubTask,
  getSubTasks,
  getSubTask,
  updateSubTask,
  deleteSubTask
};
