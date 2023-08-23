const httpStatus = require('http-status');
const { Risk } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const issueService = require('./issue.service');
const { Between } = require('typeorm');

const riskRepository = dataSource.getRepository(Risk).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<Risk>}
 */
const createRisk = async (riskBody) => {
    const risk = riskRepository.create(riskBody);
    return await riskRepository.save(risk);
};

/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryRisks = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await riskRepository.find({
        relations: ['project'],
        tableName: 'risk',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<Risk>}
 */
const getRisksByDate = async (startDate, endDate) => {

    return await riskRepository.find({
        where: {
            createdAt: Between(
                new Date(startDate).toISOString(),
                new Date(endDate).toISOString()
            ),
        },
        relations: ['project']
    });
};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<Risk>}
 */

const getRiskByProjectId = async (id) => {
    return await riskRepository.find(
        {
            where: {
                projectId: id
            },
            relations: ['project']
        });
};

const getRiskById = async (id) => {
    return await riskRepository.findOne(
        {
            where: { id: id },
            relations: ['project']
        });
};

const getAllCriticalRisks = async () => {
    return await riskRepository.find(
        {
            where: {
                riskRate: "Critical"
            },
            relations: ['project']
        });
};



const updateRiskStatus = async (riskId, status) => {
    return await riskRepository.update({ id: "Transfered" })
};

/**
 * Update user by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Risk>}
 */
const updateRiskById = async (riskId, updateBody) => {
    const risk = await getRiskById(riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    await riskRepository.update({ id: riskId }, updateBody);
    return await getRiskById(riskId);
};

/**
 * Delete user by id
 * @param {ObjectId} riskId
 * @returns {Promise<Risk>}
 */
const deleteRiskById = async (riskId) => {
    const risk = await getRiskById(riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    return await riskRepository.delete({ id: riskId });
};

const getAllRiskAndIssuesByProjectId = async (projectId) => {
    const risksByProjectId = await getRiskByProjectId(projectId);
    const issuesByProjectId = await issueService.getIssueByProjectId(projectId);
    return {
        Risks: risksByProjectId,
        Issues: issuesByProjectId
    };
};

module.exports = {
    createRisk,
    queryRisks,
    getRisksByDate,
    getRiskById,
    getRiskByProjectId,
    updateRiskById,
    deleteRiskById,
    updateRiskStatus,
    getAllCriticalRisks,
    getAllRiskAndIssuesByProjectId
};
