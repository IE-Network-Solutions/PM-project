const express = require('express');
const { Todo } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .get(Todo.getTodos)
    .post(Todo.createTodo);

router
    .route("/:id")
    .get(Todo.getTodo)
    .delete(Todo.deleteTodo)
    .patch(Todo.updateTodo);

router
    .route('/get-todo-by-criteria-id/:id')
    .get(Todo.getTodoByCriteriaId)

module.exports = router;