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
 * @module individualLL
 */
/**
 * Creates an individual life lesson record.
 * @async
 * @function
 * @param {Object} individualLLBody - The body containing individual life lesson data.
 * @returns {Promise<Object>} - A promise resolving to the saved individual life lesson record.
 */
const createIndividualLL = async (individualLLBody) => {
    const result = individualLLRepository.create(individualLLBody);
    return await individualLLRepository.save(result);
};
/**
 * Retrieves evaluation data, including checklist and todo evaluation details.
 * @async
 * @function
 * @param {Object} filter - The filter criteria for querying individual life lessons.
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of records to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<{ evalution: any[], todoEvalution: any[] }>} - A promise resolving to an object containing evaluation and todo evaluation arrays.
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
 * Retrieves an individual life lesson record by its ID.
 * @async
 * @function
 * @param {number} id - The ID of the individual life lesson.
 * @returns {Promise<Object>} - A promise resolving to the retrieved individual life lesson record.
 */
const getIndividualLLById = async (id) => {
    return await individualLLRepository.findOne({
        where: { id: id },
        relations: ['lessonLearned']
    });
};
/**
 * Updates an individual life lesson record by its ID.
 * @async
 * @function
 * @param {number} individualLLId - The ID of the individual life lesson.
 * @param {Object} updateBody - The data to update the individual life lesson.
 * @throws {ApiError} - Throws an error if the individual lesson is not found.
 * @returns {Promise<Object>} - A promise resolving to the updated individual life lesson record.
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
 * Deletes an individual life lesson record by its ID.
 * @async
 * @function
 * @param {number} individualLLId - The ID of the individual life lesson.
 * @throws {ApiError} - Throws an error if the individual lesson is not found.
 * @returns {Promise<void>} - A promise resolving after successful deletion.
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
