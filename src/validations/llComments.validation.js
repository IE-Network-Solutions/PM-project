const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLLComment = {
    body: Joi.object().keys({
        userName: Joi.string().required(),
        userId: Joi.string().required(),
        comment: Joi.string().required(),
        date: Joi.string().required(),
        LLId: Joi.string().custom(objectId),
    }),
};

const getLLComments = {
    query: Joi.object().keys({
        id: Joi.string(),
        userName: Joi.string(),
        userId: Joi.string(),
        comment: Joi.string(),
        LLId: Joi.string(),
        date: Joi.string(),
    }),
};

const getLLComment = {
    params: Joi.object().keys({
        commentId: Joi.string().custom(objectId),
    }),
};

const updateLLComment = {
    params: Joi.object().keys({
        commentId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        userName: Joi.string().required(),
        userId: Joi.string().required(),
        comment: Joi.string().required(),
        date: Joi.string().required(),
    })
        .min(1),
};

const deleteLLComment = {
    params: Joi.object().keys({
        commentId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createLLComment,
    getLLComments,
    getLLComment,
    updateLLComment,
    deleteLLComment
};
