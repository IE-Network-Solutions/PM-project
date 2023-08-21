const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMom = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getMoms = {
  query: Joi.object().keys({
  }),
};

const getMom = {
  params: Joi.object().keys({
    MomId: Joi.string(),
  }),
};

const updateMom = {
  params: Joi.object().keys({
    MomId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteMom = {
    params: Joi.object().keys({
        MomId: Joi.string(),
    }),
  };

module.exports = {
  createMom,
  getMoms,
  getMom,
  updateMom,
  deleteMom
};
