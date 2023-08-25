const Joi = require('joi');
const { objectId } = require('./custom.validation');

const weeklyReport = {
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
};

module.exports = {
  weeklyReport
};
