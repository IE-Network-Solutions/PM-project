const httpStatus = require('http-status');
const { Risk } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

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

    return await riskRepository.findAll({
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
const getRiskById = async (id) => {
    return await riskRepository.findOneBy({ id: id });
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

module.exports = {
    createRisk,
    queryRisks,
    getRiskById,
    updateRiskById,
    deleteRiskById,
};
