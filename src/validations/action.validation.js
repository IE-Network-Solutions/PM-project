const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAction = {
    body: Joi.object().keys({
        responsiblePersonName: Joi.string().required(),
        responsiblePersonId: Joi.string().required(),
        authorizedPersonName: Joi.string().required(),
        authorizedPersonId: Joi.string().required(),
        action: Joi.string().required(),
        AAAId: Joi.string().required(),

    }),
};

const getActions = {
    query: Joi.object().keys({
        responsiblePersonName: Joi.string(),
        responsiblePersonId: Joi.string(),
        authorizedPersonName: Joi.string(),
        authorizedPersonId: Joi.string(),
        action: Joi.string()
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
        responsiblePersonName: Joi.string().required(),
        responsiblePersonId: Joi.string().required(),
        authorizedPersonName: Joi.string().required(),
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
