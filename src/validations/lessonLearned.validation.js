const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module lessonLearned
 */
/**
 * Validation schema for creating a lessons learned.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.name - Name of the lessons learned (required).
 * @property {string} body.PMOMName - Name of the Project Manager or Owner's Manager (required).
 * @property {string} body.PMOMId - ID of the Project Manager or Owner's Manager (required).
 * @property {string} body.PMName - Name of the Project Manager (required).
 * @property {string} body.PMId - ID of the Project Manager (required).
 * @property {string} body.status - Status of the lessons learned (required, should be one of 'Created', 'Pending', 'CEO Pending', 'Approved').
 * @property {string} body.projectId - ID of the project associated with the lessons learned (required).
 * @property {string} body.departmentId - ID of the department associated with the lessons learned (required).
 */
const createLL = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        PMOMName: Joi.string().required(),
        PMOMId: Joi.string().required(),
        PMName: Joi.string().required(),
        PMId: Joi.string().required(),
        status: Joi.string().valid("Created", "Pending", "CEO Pending", "Approved").required(),
        projectId: Joi.string().required(),
        departmentId: Joi.string().required()
    }),
};
/**
 * Validation schema for getting lessons learned.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.name] - Name of the lessons learned.
 * @property {string} [query.PMOMName] - Name of the Project Manager or Owner's Manager.
 * @property {string} [query.PMOMId] - ID of the Project Manager or Owner's Manager.
 * @property {string} [query.PMName] - Name of the Project Manager.
 * @property {string} [query.PMNId] - ID of the Project Manager.
 * @property {string} [query.status] - Status of the lessons learned.
 * @property {string} [query.date] - Date of the lessons learned.
 * @property {string} [query.projectId] - ID of the project associated with the lessons learned.
 * @property {string} [query.departmentId] - ID of the department associated with the lessons learned.
 */
const getLLs = {
    query: Joi.object().keys({
        name: Joi.string(),
        PMOMName: Joi.string(),
        PMOMId: Joi.string(),
        PMName: Joi.string(),
        PMNId: Joi.string(),
        status: Joi.string(),
        date: Joi.string(),
        projectId: Joi.string(),
        departmentId: Joi.string()
    }),
};
/**
 * Validation schema for getting a single lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned to retrieve.
 */
const getLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting lessons learned by project ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve lessons learned for (required).
 */
const getLLByProjectId = {
    params: Joi.object().keys({
        projectId: Joi.required(),
    }),
};
/**
 * Validation schema for getting lessons learned by department ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.departmentId - ID of the department to retrieve lessons learned for.
 */
const getLLByDepartmentId = {
    params: Joi.object().keys({
        departmentId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for updating a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned to update.
 * @property {Object} body - Request body object.
 * @property {string} body.name - Name of the lessons learned (required).
 * @property {string} body.PMOMName - Name of the Project Manager or Owner's Manager (required).
 * @property {string} body.PMOMId - ID of the Project Manager or Owner's Manager (required).
 * @property {string} body.PMName - Name of the Project Manager (required).
 * @property {string} body.PMId - ID of the Project Manager (required).
 * @property {string} body.status - Status of the lessons learned (required, should be one of 'Created', 'Pending', 'CEO Pending', 'Approved', default is 'Created').
 * @property {Date} body.date - Date of the lessons learned (required).
 */
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
        date: Joi.date().required(),
    })
        .min(1),
};
/**
 * Validation schema for deleting a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned to delete.
 */
const deleteLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};


//Additional Routes/API's (for getting and approval of ll by different levels [CEO, PMOM])
/**
 * Validation schema for an approval request by Project Manager.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned for which approval is requested.
 */
const approvalRequestByPM = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for an approval request by Project Manager office Manager for a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned for which approval is requested.
 */
const approvalRequestByPMOMLLById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting all lessons learned by Project Manager office Manager by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the Project Manager or Owner's Manager.
 */
const getAllLLByPMOMById = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for an approval request for CEO for a lessons learned by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned for which approval is requested.
 */
const approvalRequestForCEO = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for approving a lessons learned by CEO by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the lessons learned to approve.
 */
const approveLLByCEO = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting all lessons learned by CEO by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.LLId - ID of the CEO.
 */
const getAllLLByCEO = {
    params: Joi.object().keys({
        LLId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createLL,
    getLLs,
    getLLById,
    getLLByProjectId,
    getLLByDepartmentId,
    updateLLById,
    deleteLLById,

    approvalRequestByPM,
    approvalRequestByPMOMLLById,
    getAllLLByPMOMById,
    approvalRequestForCEO,
    getAllLLByCEO,
    approveLLByCEO
};
