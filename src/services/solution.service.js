const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Solution } = require('../models');

const solutionRepository = dataSource.getRepository(Solution).extend({
    findAll,
    sortBy,
});
/**
 * @module solutions
 */
/**
 * Creates a solution asynchronously.
 * @function
 * @param {Object} body - The solution data to be created.
 * @returns {Promise<Object>} - A promise that resolves to the saved solution.
 */
const createSolution = async (body) => {
    const solution = await solutionRepository.create(body);
    return await solutionRepository.save(solution);
};
/**
 * Retrieves solutions asynchronously.
 * @function
 * @returns {Promise<Object[]>} - A promise that resolves to an array of solutions.
 */
const getSolutions = async () => {
    return await solutionRepository.find();
};
/**
 * Retrieves a solution asynchronously based on the provided ID.
 * @function
 * @param {number} id - The ID of the solution to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the found solution or null if not found.
 */
const getSolution = async (id) => {
    return await solutionRepository.findOne({ where: { id: id } });
};
/**
 * Deletes a solution asynchronously based on the provided ID.
 * @function
 * @param {number} id - The ID of the solution to delete.
 * @returns {Promise<void>} - A promise that resolves when the solution is successfully deleted.
 */
const deleteSolution = async (id) => {
    return await solutionRepository.delete({ id: id });
};
/**
 * Updates a solution asynchronously based on the provided ID.
 * @function
 * @param {number} id - The ID of the solution to update.
 * @param {Object} body - The updated solution data.
 * @returns {Promise<void>} - A promise that resolves when the solution is successfully updated.
 */
const updateSolution = async (id, body) => {
    return await solutionRepository.update({ id: id }, body);
};



module.exports = {
    createSolution,
    getSolutions,
    getSolution,
    deleteSolution,
    updateSolution
};
