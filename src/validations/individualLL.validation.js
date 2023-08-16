const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createIndividualLL = {
    body: Joi.object().keys({
        LLOwnerName: Joi.string().required(),
        LLOwnerId: Joi.string().required(),
        problem: Joi.string().required(),
        impact: Joi.string().required(),
        lessonLearned: Joi.string().required(),
        LLId: Joi.string().custom(objectId)
    }),
};

const getIndividualLLs = {
    query: Joi.object().keys({
        LLOwnerName: Joi.string(),
        LLOwnerId: Joi.string(),
        problem: Joi.string(),
        impact: Joi.string(),
        lessonLearned: Joi.string(),
        IindividualLLId: Joi.string()
    }),
};

const getIndividualLLById = {
    params: Joi.object().keys({
        individualLLId: Joi.string().custom(objectId),
    }),
};

const updateIndividualLLById = {
    params: Joi.object().keys({
        individualLLId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        LLOwnerName: Joi.string().required(),
        LLOwnerId: Joi.string().required(),
        problem: Joi.string().required(),
        impact: Joi.string().required(),
        lessonLearned: Joi.string().required(),
    })
        .min(1),
};

const deleteIndividualLLById = {
    params: Joi.object().keys({
        individualLLId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createIndividualLL,
    getIndividualLLs,
    getIndividualLLById,
    updateIndividualLLById,
    deleteIndividualLLById
};
