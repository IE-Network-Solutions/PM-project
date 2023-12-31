const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAAA = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    rootCause: Joi.string().required(),
    lessonLearned: Joi.string().required(),
    remarks: Joi.string().required(),
    projectId: Joi.string().required(),
    departments: Joi.array().items(Joi.string().custom(objectId)).required(),
    issueRelatesId: Joi.array().items(Joi.string().custom(objectId)).required(),
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
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      rootCause: Joi.string(),
      lessonLearned: Joi.string(),
      remarks: Joi.string(),
      projectId: Joi.string(),
      departments: Joi.array().items(Joi.string().custom(objectId)),
      issueRelatesId: Joi.array().items(Joi.string().custom(objectId)),
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
  getAllAAAByProjectId,
};
