const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module AAA
 */
/**
 * Validation schema for creating AAA.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.title - Title of the AAA.
 * @property {string} body.description - Description of the AAA.
 * @property {string} body.rootCause - Root cause of the AAA.
 * @property {string} body.lessonLearned - Lesson learned from the AAA.
 * @property {string} body.remarks - Remarks about the AAA.
 * @property {string} body.projectId - ID of the project related to the AAA.
 * @property {string[]} body.departments - Array of department IDs related to the AAA.
 * @property {string[]} body.issueRelatesId - Array of issue IDs related to the AAA.
 */
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
/**
 * Validation schema for getting AAAs.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.title] - Title of the AAA.
 * @property {string} [query.description] - Description of the AAA.
 * @property {string} [query.teamInvolves] - Team involved in the AAA.
 * @property {string} [query.rootCause] - Root cause of the AAA.
 * @property {string} [query.lessonLearned] - Lesson learned from the AAA.
 * @property {string} [query.remarks] - Remarks about the AAA.
 * @property {string} [query.relatedIssueId] - ID of the related issue.
 */
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
/**
 * Validation schema for getting a single AAA by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.AAAId - ID of the AAA to retrieve.
 */
const getAAA = {
  params: Joi.object().keys({
    AAAId: Joi.string().custom(objectId),
  }),
};

/**
 * Validation schema for updating a single AAA.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.AAAId - ID of the AAA to update.
 * @property {Object} body - Request body object.
 * @property {string} [body.title] - New title of the AAA.
 * @property {string} [body.description] - New description of the AAA.
 * @property {string} [body.rootCause] - New root cause of the AAA.
 * @property {string} [body.lessonLearned] - New lesson learned from the AAA.
 * @property {string} [body.remarks] - New remarks about the AAA.
 * @property {string} [body.projectId] - New ID of the project related to the AAA.
 * @property {string[]} [body.departments] - New array of department IDs related to the AAA.
 * @property {string[]} [body.issueRelatesId] - New array of issue IDs related to the AAA.
 */
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
/**
 * Validation schema for deleting a single AAA.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.AAAId - ID of the AAA to delete.
 */
const deleteAAA = {
  params: Joi.object().keys({
    AAAId: Joi.string().custom(objectId),
  }),
};
/**
 * Validation schema for getting all AAA items by project ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve AAA items for.
 */
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
