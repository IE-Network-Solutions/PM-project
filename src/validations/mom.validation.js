const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMom = {
  body: Joi.object().keys({
    projectId: Joi.string().required(),
    title: Joi.string().required(),
    objective: Joi.string(),
    meetingDate: Joi.date(),
    meetingTime: Joi.string(),
    location: Joi.string(),
    facilitatorId: Joi.string(),
    specialNote: Joi.string(),
    attendees: Joi.array(),
    externalAttendees: Joi.array(),
    action: Joi.array(), 
    agenda: Joi.array(),
  }),
};

const getMoms = {
  query: Joi.object().keys({
  }),
};



const getMom = {
  params: Joi.object().keys({
    momId: Joi.string(),
  }),
};

const getByProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};

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
    specialNote: Joi.string(),
    attendees: Joi.array(),
    externalAttendees: Joi.array(),
    action: Joi.array(), 
    agenda: Joi.array(),
  }),
};

const deleteMom = {
    params: Joi.object().keys({
        MomId: Joi.string(),
    }),
  };

const addComment = {
    body: Joi.object().keys({
      id: Joi.string().required(),
      comment: Joi.string().required(),
      userId: Joi.string().required(),
      mentionedId: Joi.string(),
    }),
  };

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
