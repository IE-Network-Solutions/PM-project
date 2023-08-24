const httpStatus = require('http-status');
const { Risk } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const issueService = require('./issue.service');
const { Between, In } = require('typeorm');

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

const getAllRisksByProjectIdAndByDate = async (id, status, startDate, endDate) => {
    return await riskRepository.find(
        {
            where: {
                projectId: id,
                status: status[0],
                createdAt: Between(
                    new Date(startDate).toISOString(),
                    new Date(endDate).toISOString()
                ),
            },
            relations: ['project']
        });
};

const getRiskById = async (id) => {
    return await riskRepository.findOne(
        {
            where: {
                id: id,
            },
            relations: ['project']
        });
};

const getAllCriticalRisks = async (status) => {
    return await riskRepository.find(
        {
            where: {
                riskRate: "Critical",
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

const getAllRiskAndIssuesByProjectIdByDate = async (projectId, status, startDate, endDate) => {
    const risksByProjectId = await getAllRisksByProjectIdAndByDate(projectId, status, startDate, endDate);
    const issuesByProjectId = await issueService.getAllIssuesByProjectIdAndByDate(projectId, "Transfered", startDate, endDate);
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
    getAllRisksByProjectIdAndByDate,
    updateRiskById,
    deleteRiskById,
    updateRiskStatus,
    getAllCriticalRisks,
    getAllRiskAndIssuesByProjectIdByDate
};
