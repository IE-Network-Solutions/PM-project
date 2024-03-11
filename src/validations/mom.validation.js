const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module MOM
 */
/**
 * Validation schema for creating a minutes of meeting (MoM).
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.projectId - ID of the project associated with the MoM (required).
 * @property {string} body.title - Title of the MoM (required).
 * @property {string} [body.objective] - Objective of the meeting.
 * @property {Date} [body.meetingDate] - Date of the meeting.
 * @property {string} [body.meetingTime] - Time of the meeting.
 * @property {string} [body.location] - Location of the meeting.
 * @property {string} [body.facilitatorId] - ID of the facilitator of the meeting.
 * @property {string} [body.specialNote] - Special notes for the meeting.
 * @property {Array} [body.attendees] - List of attendees.
 * @property {Array} [body.absents] - List of absentees.
 * @property {Array} [body.externalAttendees] - List of external attendees.
 * @property {Array} [body.action] - List of actions from the meeting.
 * @property {Array} [body.agenda] - List of agenda items for the meeting.
 */
const createMom = {
  body: Joi.object().keys({
    projectId: Joi.string().required(),
    title: Joi.string().required(),
    objective: Joi.string(),
    meetingDate: Joi.date(),
    meetingTime: Joi.string(),
    location: Joi.string(),
    facilitatorId: Joi.string(),
    specialNote: Joi.string().allow(null || ""),
    attendees: Joi.array(),
    absents: Joi.array().allow(null),
    externalAttendees: Joi.array(),
    action: Joi.array(),
    agenda: Joi.array(),
  }),
};
/**
 * Validation schema for getting all minutes of meetings (MoMs).
 * @type {Object}
 * @property {Object} query - Query parameters object.
 */
const getMoms = {
  query: Joi.object().keys({
  }),
};

/**
 * Validation schema for getting a single minutes of meeting (MoM) by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.momId - ID of the MoM to retrieve.
 */
const getMom = {
  params: Joi.object().keys({
    momId: Joi.string(),
  }),
};
/**
 * Validation schema for getting minutes of meetings (MoMs) by project ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve MoMs for.
 */
const getByProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};
/**
 * Validation schema for updating minutes of meeting (MoM) by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.momId - ID of the MoM to update (required).
 * @property {Object} body - Request body object.
 * @property {string} [body.projectId] - ID of the project associated with the MoM.
 * @property {string} [body.title] - Title of the MoM.
 * @property {string} [body.objective] - Objective of the meeting.
 * @property {Date} [body.meetingDate] - Date of the meeting.
 * @property {string} [body.meetingTime] - Time of the meeting.
 * @property {string} [body.location] - Location of the meeting.
 * @property {string} [body.facilitatorId] - ID of the facilitator of the meeting.
 * @property {string} [body.specialNote] - Special notes for the meeting.
 * @property {Array} [body.attendees] - List of attendees.
 * @property {Array} [body.absents] - List of absentees.
 * @property {Array} [body.externalAttendees] - List of external attendees.
 * @property {Array} [body.action] - List of actions from the meeting.
 * @property {Array} [body.agenda] - List of agenda items for the meeting.
 */
const updateMom = {
  params: Joi.object().keys({
    momId: Joi.required(),
  }),
  body: Joi.object().keys({
    projectId: Joi.string(),
    title: Joi.string(),
    objective: Joi.string(),
    meetingDate: Joi.date(),
    meetingTime: Joi.string(),
    location: Joi.string(),
    facilitatorId: Joi.string(),
    specialNote: Joi.string().allow(null || ""),
    momAttendees: Joi.array(),
    momAbsents: Joi.array(),
    externalAttendees: Joi.array(),
    momAction: Joi.array(),
    momAgenda: Joi.array(),
    momComment: Joi.array(),
  }),
};
/**
 * Validation schema for deleting a minutes of meeting (MoM) by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.MomId - ID of the MoM to delete.
 */

const deleteMom = {
  params: Joi.object().keys({
    momId: Joi.string(),
  }),
};
/**
 * Validation schema for adding a comment to a minutes of meeting (MoM).
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.id - ID of the MoM.
 * @property {string} body.comment - Content of the comment (required).
 * @property {string} body.userId - ID of the user adding the comment (required).
 * @property {string} [body.mentionedId] - ID of the mentioned user.
 */
const addComment = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    comment: Joi.string().required(),
    userId: Joi.string().required(),
    mentionedId: Joi.string(),
  }),
};
/**
 * Validation schema for getting comments of a minutes of meeting (MoM).
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.momId - ID of the MoM to get comments for (required).
 */
const getComments = {
  params: Joi.object().keys({
    momId: Joi.string().required(),
  }),
};

module.exports = {
  createMom,
  getMoms,
  getMom,
  getByProject,
  updateMom,
  deleteMom,
  addComment,
  getComments
};
