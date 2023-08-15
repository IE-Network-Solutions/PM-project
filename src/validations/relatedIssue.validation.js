const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRelatedIssue = {
    body: Joi.object().keys({
        name: Joi.string().required(),
    }),
};

const getRelatedIssues = {
    query: Joi.object().keys({
        name: Joi.string(),
    }),
};

const getRelatedIssue = {
    params: Joi.object().keys({
        relatedIssueId: Joi.string().custom(objectId),
    }),
};

const updateRelatedIssueById = {
    params: Joi.object().keys({
        relatedIssueId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
    })
        .min(1),
};

const deleteRelatedIssueById = {
    params: Joi.object().keys({
        relatedIssueId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createRelatedIssue,
    getRelatedIssues,
    getRelatedIssue,
    updateRelatedIssueById,
    deleteRelatedIssueById
};
