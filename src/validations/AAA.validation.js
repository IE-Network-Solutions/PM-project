const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAAA = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        teamInvolves: Joi.string().required(),
        rootCause: Joi.string().required(),
        lessonLearned: Joi.string().required(),
        remarks: Joi.string().required(),
        projectId: Joi.string().required(),
        actions: Joi.array().required(),
        relatedIssueId: Joi.array().items(Joi.string().custom(objectId))  // Assuming objectId is your custom validation function
            .required(),
    }),
};

const getAAAs = {
    query: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        teamInvolves: Joi.string(),
        rootCause: Joi.string(),
        lessonLearned: Joi.string(),
        remarks: Joi.string(),
        relatedIssueId: Joi.string(),
    }),
};

const getAAA = {
    params: Joi.object().keys({
        AAAId: Joi.string().custom(objectId),
    }),
};

const updateAAA = {
    params: Joi.object().keys({
        AAAId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        teamInvolves: Joi.string().required(),
        rootCause: Joi.string().required(),
        lessonLearned: Joi.string().required(),
        remarks: Joi.string().required(),
        projectId: Joi.string(),
        actions: Joi.array().required()
        // projectId: Joi.string().custom(objectId),
        // issueId: Joi.string().custom(objectId),
    })
        .min(1),
};

const deleteAAA = {
    params: Joi.object().keys({
        AAAId: Joi.string().custom(objectId),
    }),
};
const getAllAAAByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createAAA,
    getAAAs,
    getAAA,
    updateAAA,
    deleteAAA,
    getAllAAAByProjectId
};
