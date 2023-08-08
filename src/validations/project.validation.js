const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    milestone: Joi.string().required(),
    budget: Joi.string().required(),
    contract_sign_date: Joi.string().required(),
    lc_opening_date: Joi.string().required(),
    advanced_payment_date: Joi.string().required(),
    status: Joi.string().required(),
    planned_end_date: Joi.string().required(),
  }),
};

const getProjects = {
  query: Joi.object().keys({
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
      postId: Joi.string(),
    }),
  };

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
};
