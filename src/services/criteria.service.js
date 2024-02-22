const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Criteria } = require('../models');

const criteriaRepository = dataSource.getRepository(Criteria).extend({ findAll, sortBy, });
/**
 * @module criteria
 */
/**
 * Creates a new criteria.
 *
 * @async
 * @function
 * @param {Object} body - The criteria data to create.
 * @returns {Promise} - A promise that resolves when the criteria is saved.
 */
const createCriteria = async (body) => {
    const solution = await criteriaRepository.create(body);
    return await criteriaRepository.save(solution);
};
/**
 * Retrieves criterias.
 *
 * @async
 * @function
 * @returns {Promise} - A promise that resolves with the retrieved criterias.
 */
const getCriterias = async () => {
    return await criteriaRepository.find({ relations: ['todo'] });
};
/**
 * Retrieves a criteria by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the criteria to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved criteria.
 */
const getCriteria = async (id) => {
    return await criteriaRepository.findOne({ where: { id: id }, relations: ['todo'] });
};
/**
 * Deletes a criteria by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the criteria to delete.
 * @returns {Promise} - A promise that resolves when the criteria is deleted.
 */
const deleteCriteria = async (id) => {
    return await criteriaRepository.delete({ id: id });
};
/**
 * Updates a criteria by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the criteria to update.
 * @param {Object} body - The updated criteria data.
 * @returns {Promise} - A promise that resolves when the criteria is updated.
 */
const updateCriteria = async (id, body) => {
    return await criteriaRepository.update({ id: id }, body);
};

module.exports = {
    createCriteria,
    getCriterias,
    getCriteria,
    deleteCriteria,
    updateCriteria
};
