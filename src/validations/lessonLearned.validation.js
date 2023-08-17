const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLL = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        PMOMName: Joi.string().required(),
        PMOMId: Joi.string().required(),
        PMName: Joi.string().required(),
        PMId: Joi.string().required(),
        status: Joi.string().valid("Created", "Pending", "CEO Pending", "Approved").required(),
        date: Joi.string().required(),
        projectId: Joi.string().required(),
        departmentId: Joi.string().required()
    }),
};

const getLLs = {
    query: Joi.object().keys({
        name: Joi.string(),
        PMOMName: Joi.string(),
        PMOMId: Joi.string(),
        PMName: Joi.string(),
        PMNId: Joi.string(),
        status: Joi.string(),
        date: Joi.string(),
        projectId: Joi.string()
    }),
};

const getLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

const updateLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        PMOMName: Joi.string().required(),
        PMOMId: Joi.string().required(),
        PMName: Joi.string().required(),
        PMId: Joi.string().required(),
        status: Joi.string().valid("Created", "Pending", "CEO Pending", "Approved").required().default("Created"),
        date: Joi.string().required(),
        projectId: Joi.string().required()
    })
        .min(1),
};

const deleteLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};


//Additional Routes/API's (for getting and approval of ll by different levels [CEO, PMOM])

const approvalRequestByPM = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

const approvalRequestByPMOMLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

const getAllLLByPMOMById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
const approvalRequestForCEO = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

const approveLLByCEO = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
const getAllLLByCEO = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createLL,
    getLLs,
    getLLById,
    updateLLById,
    deleteLLById,

    approvalRequestByPM,
    approvalRequestByPMOMLLById,
    getAllLLByPMOMById,
    approvalRequestForCEO,
    getAllLLByCEO,
    approveLLByCEO
};
