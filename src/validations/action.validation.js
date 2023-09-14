const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAction = {
    body: Joi.object().keys({
        actions: Joi.array(),
        afterActionAnalysisId: Joi.string().custom(objectId),
    }),
};

const getActions = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getAction = {
    params: Joi.object().keys({
        actionId: Joi.string().custom(objectId),
    }),
};

const updateActionById = {
    params: Joi.object().keys({
        actionId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        responsiblePersonId: Joi.string().required(),
        authorizedPersonId: Joi.string().required(),
        action: Joi.string().required(),
    })
        .min(1),
};

const deleteActionById = {
    params: Joi.object().keys({
        actionId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createAction,
    getActions,
    getAction,
    updateActionById,
    deleteActionById
};
