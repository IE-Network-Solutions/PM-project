const catchAsync = require("../utils/catchAsync");
const { Todo } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const createTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.createTodo(req.body);
    res.status(httpStatus.CREATED).send(todo);
})

const getTodos = catchAsync(async (req, res, next) => {
    const todo = await Todo.getTodos();
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    res.send(todo);
})

const getTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.getTodo(req.params.id);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    res.send(todo);
})

const getTodoByCriteriaId = catchAsync(async (req, res, next) => {
    const criteria = await Todo.getTodoByCriteriaId(req.params.id);

    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    res.send(criteria);
})

const deleteTodo = catchAsync(async (req, res) => {
    const todo = await Todo.getTodo(req.params.id);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo NOT FOUND');
    }
    await Todo.deleteTodo(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

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