const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Todo } = require('../models');

const todoRepository = dataSource.getRepository(Todo).extend({
    findAll,
    sortBy,
});
/**
 * @module todo
 */
/**
 * Creates a new todo with the provided data.
 * @function
 * @param {Object} body - The data for the todo to create.
 * @returns {Promise<Object>} A Promise that resolves with the created todo.
 */

const createTodo = async (body) => {
    const todo = await todoRepository.create(body);
    return await todoRepository.save(todo);
};
/**
 * Retrieves all todos along with their related criteria.
 * @function
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of todos with their related criteria.
 */

const getTodos = async () => {
    return await todoRepository.find({ relations: ["criteria"] });
};
/**
 * Retrieves a todo by its ID along with its related criteria.
 * @function
 * @param {string} id - The ID of the todo to retrieve.
 * @returns {Promise<Object|null>} A Promise that resolves with the retrieved todo if found, or null if not found.
 */
const getTodo = async (id) => {
    return await todoRepository.findOne({ where: { id: id }, relations: ["criteria"] });
};
/**
 * Retrieves todos associated with the specified criteria ID along with their related criteria.
 * @function
 * @param {string} id - The ID of the criteria to retrieve todos for.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of todos associated with the specified criteria.
 */

const getTodoByCriteriaId = async (id) => {
    return await todoRepository.find({ where: { criteriaId: id }, relations: ['criteria'] });
};
/**
 * Deletes a todo by its ID.
 * @function
 * @param {string} id - The ID of the todo to delete.
 * @returns {Promise<void>} A Promise that resolves once the todo is deleted.
 */

const deleteTodo = async (id) => {
    return await todoRepository.delete({ id: id });
};
/**
 * Updates a todo by its ID with the provided data.
 * @function
 * @param {string} id - The ID of the todo to update.
 * @param {Object} body - The data to update the todo with.
 * @returns {Promise<void>} A Promise that resolves once the todo is updated.
 */

const updateTodo = async (id, body) => {
    return await todoRepository.update({ id: id }, body);
};

module.exports = {
    createTodo,
    getTodos,
    getTodo,
    deleteTodo,
    updateTodo,
    getTodoByCriteriaId
};
