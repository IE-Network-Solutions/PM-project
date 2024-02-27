const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { ProjectContractValue } = require('../models');
/**
 * @module project
 */
/**
 * Schema for creating a project.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.name - Name of the project (required).
 * @property {number} [body.milestone] - Milestone of the project.
 * @property {any} body.budget - Budget of the project (required).
 * @property {Date} body.contract_sign_date - Contract signing date.
 * @property {Date} body.lc_opening_date - LC opening date.
 * @property {Date} body.advanced_payment_date - Advanced payment date.
 * @property {boolean} body.status - Status of the project.
 * @property {Date} body.planned_end_date - Planned end date of the project (required).
 * @property {boolean} body.isOffice - Indicates if the project is an office project.
 * @property {Array} [body.projectMembers] - Array of project members.
 * @property {Array} [body.projectContractValue] - Array of project contract values.
 * @property {string} body.clientId - ID of the client associated with the project.
 */
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
/**
 * Schema for creating an office project.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.name - Name of the project (required).
 * @property {boolean} body.isOffice - Indicates if the project is an office project.
 * @property {Array} [body.projectMembers] - Array of project members.
 * @property {boolean} body.status - Status of the project.
 * @property {string} body.clientId - ID of the client associated with the project.
 */
const createOfficeProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    isOffice: Joi.boolean(),
    projectMembers: Joi.array(),
    status: Joi.boolean(),
    clientId: Joi.string()
  }),
};
/**
 * Schema for getting projects.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return per page.
 * @property {number} [query.page] - Page number.
 */
const getProjects = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

/**
 * Schema for getting a project by ID.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.projectId - ID of the project (required).
 */
const getProject = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
};
/**
 * Schema for updating a project.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.projectId - ID of the project (required).
 * @property {object} body - Request body.
 * @property {boolean} [body.isOffice] - Indicates if the project is an office project.
 * @property {string} [body.name] - Name of the project.
 * @property {string} [body.clientId] - ID of the client associated with the project.
 * @property {number} [body.milestone] - Milestone of the project.
 * @property {any} [body.budget] - Budget of the project.
 * @property {Date} [body.contract_sign_date] - Contract signing date.
 * @property {Date} [body.lc_opening_date] - LC opening date.
 * @property {Date} [body.advanced_payment_date] - Advanced payment date.
 * @property {boolean} [body.status] - Status of the project.
 * @property {Date} [body.planned_end_date] - Planned end date of the project.
 * @property {Array} [body.projectMembers] - Array of project members.
 * @property {Array} [body.projectContractValue] - Array of project contract values.
 * @property {Date} [body.plannedStart] - Planned start date of the project.
 * @property {Date} [body.plannedFinish] - Planned finish date of the project.
 * @property {number} [body.startVariance] - Start variance of the project.
 * @property {number} [body.finishVariance] - Finish variance of the project.
 * @property {Date} [body.actualStart] - Actual start date of the project.
 * @property {Date} [body.actualFinish] - Actual finish date of the project.
 * @property {Date} [body.start] - Start date of the project.
 * @property {Date} [body.finish] - Finish date of the project.
 * @property {number} [body.actualDuration] - Actual duration of the project.
 */
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

/**
 * Schema for deleting a project.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} [params.projectId] - ID of the project.
 */
const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};
/**
 * Schema for getting project variance by ID.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.projectId - ID of the project.
 */
const getProjectVariance = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};
/**
 * Schema for adding members to a project.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} params.projectId - ID of the project (required).
 * @property {object} body - Request body.
 * @property {Array} body - Array of members to add to the project.
 */
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
/**
 * Schema for removing a member from a project.
 * @type {object}
 * @property {object} params - URL parameters.
 * @property {string} [params.projectId] - ID of the project.
 */
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
