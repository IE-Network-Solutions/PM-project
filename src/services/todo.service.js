const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Todo } = require('../models');

const todoRepository = dataSource.getRepository(Todo).extend({
    findAll,
    sortBy,
});

const createTodo = async (body) => {
    const todo = await todoRepository.create(body);
    return await todoRepository.save(todo);
};

const getTodos = async () => {
    return await todoRepository.find({ relations: ["criteria"] });
};

const getTodo = async (id) => {
    return await todoRepository.findOne({ where: { id: id }, relations: ["criteria"] });
};

const getTodoByCriteriaId = async (id) => {
    return await todoRepository.find({ where: { criteriaId: id }, relations: ['criteria'] });
};

const deleteTodo = async (id) => {
    return await todoRepository.delete({ id: id });
};

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