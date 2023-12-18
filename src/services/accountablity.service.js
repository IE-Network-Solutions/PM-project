/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { Action, AfterActionAnalysis, Accountablity } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { getAAAById } = require('./AAA.service');
const { getUserById } = require('./user.service');

const accountablityRepository = dataSource.getRepository(Accountablity).extend({ findAll, sortBy });

// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} actionBody
 * @returns {Promise<Action>}
 */
const createAccountablity = async (accBody, afterActionAnalysisId) => {

    const aaaExists = await getAAAById(afterActionAnalysisId)
    let newObject = {}

    if (!aaaExists) {

        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    else {

        const accountablity = accountablityRepository.create({
            description: accBody.description,
            responsiblePersonId: accBody.responsiblePersonId,
            afterActionAnalysisId: afterActionAnalysisId

        })
        const savedAccountablity = await accountablityRepository.save(accountablity)

        const accountable = await getAccountablityById(savedAccountablity.id)

        return accountable


    }


}
/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryAccountablities = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await accountablityRepository.find({
        relations: ['responsiblePerson'],
        tableName: 'accuntablities',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};




/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<Action>}
 */
const getAccountablityById = async (id) => {
    console.log(id, "nnbgid")
    return await accountablityRepository.findOne(
        {
            where: { id: id },
            relations: ['responsiblePerson']
        });
};

/**
 * Update user by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Action>}
 */
const updateAccountablityById = async (accId, updateBody) => {
    const accExist = await getAccountablityById(accId);
    if (!accExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'acc Id not found');
    }
    await accountablityRepository.update({ id: accId }, updateBody);
    return await getAccountablityById(actionId);
};

/**
 * Delete user by id
 * @param {ObjectId} actionId
 * @returns {Promise<Action>}
 */
const deleteAccountablityById = async (accId) => {
    const accExist = await getAccountablityById(accId);
    if (!accExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'acc Id not found');
    }
    return await accountablityRepository.delete({ id: accId });
};

module.exports = {
    createAccountablity,
    queryAccountablities,
    getAccountablityById,
    updateAccountablityById,
    deleteAccountablityById,
};
