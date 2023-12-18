const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAccountablity = {
    body: Joi.object().keys({
        accountablities: Joi.array(),
        afterActionAnalysisId: Joi.string().custom(objectId),
    }),
};

const getAccountablityies = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getAccountablity = {
    params: Joi.object().keys({
        accId: Joi.string().custom(objectId),
    }),
};

const updateAccountablityById = {
    params: Joi.object().keys({
        accIdId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        responsiblePersonId: Joi.string().required(),

        accountablityies: Joi.string().required(),
    })
        .min(1),
};

const deleteAccountablityById = {
    params: Joi.object().keys({
        accId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createAccountablity,
    getAccountablityies,
    getAccountablity,
    updateAccountablityById,
    deleteAccountablityById
};
