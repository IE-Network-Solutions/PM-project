const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { ProjectContractValue } = require('../models');

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    milestone: Joi.number(),
    budget: Joi.required(),
    contract_sign_date: Joi.date(),
    lc_opening_date: Joi.date(),
    advanced_payment_date: Joi.date(),
    status: Joi.boolean(),
    planned_end_date: Joi.required(),
    isOffice: Joi.boolean(),
    projectMembers: Joi.array(),
    projectContractValue: Joi.array(),
    isOffice: Joi.boolean(),
    clientId: Joi.string()

  }),
};

const createOfficeProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    isOffice: Joi.boolean(),
    projectMembers: Joi.array(),
    status: Joi.boolean(),
    clientId: Joi.string()
  }),
};

const getProjects = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      isOffice: Joi.boolean(),
      name: Joi.string(),
      clientId: Joi.string(),
      milestone: Joi.number(),
      budget: Joi.string(),
      contract_sign_date: Joi.date(),
      lc_opening_date: Joi.date(),
      advanced_payment_date: Joi.date(),
      status: Joi.boolean(),
      planned_end_date: Joi.date(),
      projectMembers: Joi.array(),
      projectContractValue: Joi.array(),
      plannedStart: Joi.date(),
      plannedFinish: Joi.date(),
      startVariance: Joi.number(),
      finishVariance: Joi.number(),
      actualStart: Joi.date(),
      actualFinish: Joi.date(),
      start: Joi.date(),
      finish: Joi.date(),
      actualDuration: Joi.number()
    })
    .min(1),
};


const updateProjectFomSchedule = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      plannedStart: Joi.date(),
      plannedFinish: Joi.date(),
      startVariance: Joi.number(),
      finishVariance: Joi.number(),
      actualStart: Joi.date(),
      actualFinish: Joi.date(),
      start: Joi.date(),
      finish: Joi.date(),
      duration: Joi.number(),
      actualDuration: Joi.number()
    })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};

const getProjectVariance = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const addMember = Joi.object().keys({
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
  body: Joi.array()
    .items(
      Joi.object().keys({
        memberId: Joi.string().required(),
        roleId: Joi.string().required(),
      })
    )
    .required(),
});

const removeMember = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectVariance,
  addMember,
  removeMember,
  createOfficeProject,
  updateProjectFomSchedule
};
