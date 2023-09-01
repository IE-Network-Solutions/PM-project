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

const addWeeklyReport ={
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }), 
}

const savedWeeklyReport ={
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }), 
}
const getReportByWeek ={
  params: Joi.object().keys({
    projectId: Joi.string().required(),
    week: Joi.string().required(),
  }), 
}

const addComment = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    comment: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

module.exports = {
  weeklyReport,
  sleepingTasks,
  addWeeklyReport,
  savedWeeklyReport,
  getReportByWeek,
  addComment
};
