const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getWeeklyReportByDate = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
    query: Joi.object().keys({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};

module.exports = { getWeeklyReportByDate }