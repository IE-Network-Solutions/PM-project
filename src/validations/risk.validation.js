const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRisk = {
    body: Joi.object().keys({
        riskDescription: Joi.string().required(),
        causedBy: Joi.string().required(),
        consequences: Joi.string().required(),
        probability: Joi.string().required(),
        riskOwner: Joi.string().required(),
        status: Joi.string().valid('Closed', 'Open').required(),
        impact: Joi.string().required(),
        control: Joi.string().valid("Avoided", "Mitigated", "Transfered", "Accepted").required(),
        controlOwner: Joi.string().required(),
        residualProbability: Joi.string().required(),
        residualImpact: Joi.string().required(),
        projectId: Joi.string().custom(objectId),
    }),
};

const getRisks = {
    query: Joi.object().keys({
        id: Joi.string(),
        riskDescription: Joi.string(),
        causedBy: Joi.string(),
        consequences: Joi.string(),
        probability: Joi.string(),
        riskOwner: Joi.string(),
        status: Joi.string(),
        impact: Joi.string(),
        control: Joi.string(),
        controlOwner: Joi.string(),
        residualProbability: Joi.string(),
        residualImpact: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getRiskByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.string().custom(objectId),
    }),
};

const getRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

const updateRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        riskDescription: Joi.string().required(),
        causedBy: Joi.string().required(),
        consequences: Joi.string().required(),
        probability: Joi.string().required(),
        riskOwner: Joi.string().required(),
        status: Joi.string().required(),
        impact: Joi.string().required(),
        control: Joi.string().required(),
        controlOwner: Joi.string().required(),
        residualProbability: Joi.string().required(),
        residualImpact: Joi.string().required(),
    })
        .min(1),
};

const deleteRisk = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

const moveRiskToIssue = {
    params: Joi.object().keys({
        riskId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createRisk,
    getRisks,
    getRisk,
    getRiskByProjectId,
    updateRisk,
    deleteRisk,
    moveRiskToIssue
};
