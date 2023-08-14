const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    name: Joi.required(),
    milestone: Joi.required(),
    budget: Joi.required(),
    contract_sign_date: Joi.required(),
    lc_opening_date: Joi.required(),
    advanced_payment_date: Joi.required(),
    status: Joi.required(),
    planned_end_date: Joi.required(),
    projectMembers: Joi.required()
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
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteProject = {
    params: Joi.object().keys({
      projectId: Joi.string(),
    }),
  };

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
};
