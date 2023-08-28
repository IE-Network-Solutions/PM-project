const Joi = require('joi');
const { objectId } = require('./custom.validation');

const weeklyReport = {
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
};

const sleepingTasks = Joi.object({
  addSleepingReason: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      
      sleepingReason: Joi.string().required(),
    })
  ),
});


module.exports = {
  weeklyReport,
  sleepingTasks
};
