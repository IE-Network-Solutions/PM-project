const httpStatus = require('http-status');
const { IndividualLL } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const individualLLRepository = dataSource.getRepository(IndividualLL).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<IndividualLL>}
 */
const createIndividualLL = async (individualLLBody) => {
    const result = individualLLRepository.create(individualLLBody);
    return await individualLLRepository.save(result);
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

const queryIndividualLLs = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await individualLLRepository.find({
        relations: ['lessonLearned'],
        tableName: 'individualLL',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<IndividualLL>}
 */
const getIndividualLLById = async (id) => {
    return await individualLLRepository.findOne({
        where: { id: id },
        relations: ['lessonLearned']
    });
};

/**
 * Update user by id
 * @param {ObjectId} issueId
 * @param {Object} updateBody
 * @returns {Promise<IndividualLL>}
 */
const updateIndividualLLById = async (individualLLId, updateBody) => {
    const result = await getIndividualLLById(individualLLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Individual Lesson learned not found');
    }
    await individualLLRepository.update({ id: individualLLId }, updateBody);
    return await getIndividualLLById(individualLLId);
};

/**
 * Delete user by id
 * @param {ObjectId} issueId
 * @returns {Promise<IndividualLL>}
 */
const deleteIndividualLLById = async (individualLLId) => {
    const result = await getIndividualLLById();
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Individual Lesson learned not found');
    }
    return await individualLLRepository.delete({ id: individualLLId });
};

module.exports = {
    createIndividualLL,
    queryIndividualLLs,
    getIndividualLLById,
    updateIndividualLLById,
    deleteIndividualLLById,
};
