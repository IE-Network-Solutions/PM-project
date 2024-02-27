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
 * @module accountability
*/
/**
 * Creates and returns an accountability instance for a given AAA instance
 * @function
 * @param {Object} accBody - The body of the accountability instance
 * @param {string} accBody.description - The description of the accountability
 * @param {number} accBody.responsiblePersonId - The ID of the responsible person
 * @param {number} afterActionAnalysisId - The ID of the AAA instance
 * @returns {Promise<Object>} - The created accountability instance with its related entities
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
 * Queries and returns the accountability instances that match the options
 * @function
 * @var {Object} options - The options object for the query
 * @var {number} options.limit - The maximum number of results to return
 * @var {number} options.page - The page number of the results
 * @var {string} [options.sortBy] - The optional sorting option for the results
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
 * Gets and returns an accountability instance by its ID
 * @function
 * @param {number} id - The ID of the accountability instance
 * @returns {Promise<Object>} - The accountability instance with its related entity
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
 * Updates and returns an accountability instance by its ID and the update body
 * @function
 * @param {number} accId - The ID of the accountability instance to update
 * @param {Object} updateBody - The update body for the accountability instance
 * @returns {Promise<Object>} - The updated accountability instance with its related entity
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
 * Deletes an accountability instance by its ID
 * @function
 * @param {number} accId - The ID of the accountability instance to delete
 * @returns {Promise<Object>} - The deleted accountability instance
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
