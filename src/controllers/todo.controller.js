const catchAsync = require("../utils/catchAsync");
const { Todo } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
/**
 * @module todo
 */
/**
 * Creates a todo record.
 * @function
 * @param {Object} req.body - The request body containing todo data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the todo record is created.
 * @throws {Error} - If there's an issue with creating the todo record.
 */
const createTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.createTodo(req.body);
    res.status(httpStatus.CREATED).send(todo);
})

/**
 * Retrieves all todo records.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the todo records are retrieved.
 * @throws {Error} - If there's an issue fetching the todo records.
 */
const getTodos = catchAsync(async (req, res, next) => {
    const todo = await Todo.getTodos();
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    res.send(todo);
})

/**
 * Retrieves a specific todo record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the todo record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the todo record is retrieved.
 * @throws {Error} - If the todo record is not found.
 */
const getTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.getTodo(req.params.id);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    res.send(todo);
})

/**
 * Retrieves todo records associated with a specific criteria.
 * @function
 * @param {Object} req.params.id - The ID of the criteria.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the todo records are retrieved.
 * @throws {Error} - If there's an issue fetching the todo records.
 */
const getTodoByCriteriaId = catchAsync(async (req, res, next) => {
    const criteria = await Todo.getTodoByCriteriaId(req.params.id);

    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    res.send(criteria);
})

/**
 * Deletes a specific todo record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the todo record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the todo record is deleted.
 * @throws {Error} - If there's an issue with deleting the todo record.
 */
const deleteTodo = catchAsync(async (req, res) => {
    const todo = await Todo.getTodo(req.params.id);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    await Todo.deleteTodo(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

/**
 * Updates a specific todo record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the todo record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the todo record is updated.
 * @throws {Error} - If there's an issue with updating the todo record.
 */
const updateTodo = catchAsync(async (req, res) => {
    const todo = await Todo.getTodo(req.params.id);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    await Todo.deleteTodo(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

module.exports = {
    createTodo,
    getTodos,
    getTodo,
    deleteTodo,
    updateTodo,
    getTodoByCriteriaId
}
