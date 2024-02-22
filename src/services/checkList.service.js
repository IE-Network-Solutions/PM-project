const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const dataSource = require('../utils/createDatabaseConnection');
const { CheckList, MilestoneCriteria, TodoEvalution } = require('../models');
const { milestoneService } = require('../services');

const checkListRepository = dataSource.getRepository(CheckList).extend({ findAll, sortBy });
const milestoneCriteriaRepository = dataSource.getRepository(MilestoneCriteria).extend({ findAll, sortBy });
const todoEvalutionRepository = dataSource.getRepository(TodoEvalution).extend({ findAll, sortBy });
/**
 * @module checkList
 */
/**
 * Creates a checklist.
 * @function
 * @param {object} body - The data for the checklist.
 * @param {string} body.name - The name of the checklist.
 * @param {number} body.milestoneId - The ID of the associated milestone.
 * @param {number} body.solutionId - The ID of the associated solution.
 * @returns {Promise<object>} - A promise that resolves with the saved checklist.
 */
const createChecklist = async (body) => {
    const checkList = await checkListRepository.create({
        name: body.name,
        milestoneId: body.milestoneId,
        solutionId: body.solutionId
    });
    return await checkListRepository.save(checkList);
};
/**
 * Creates milestone criteria associations.
 * @function
 * @param {number} milestoneId - The unique identifier of the milestone.
 * @param {number[]} criteriaIds - An array of criteria IDs to associate with the milestone.
 * @returns {Promise<object[]>} - A promise that resolves with an array of saved milestone criteria associations.
 */
const createMilestoneCriteria = async (milestoneId, criteriaIds = []) => {
    const milestoneCriteria = criteriaIds?.map((criteriaId) => {
        const milestoneCriterion = milestoneCriteriaRepository.create({
            milestoneId : milestoneId,
            criteriaId: criteriaId
        });
        return milestoneCriterion;
    });
    return await milestoneCriteriaRepository.save(milestoneCriteria);
}
/**
 * Creates a todo evaluation.
 * @function
 * @param {string} evalutionId - The ID of the evaluation.
 * @param {Array} todoEvalutionIds - An array of todo evaluation IDs.
 * @returns {Promise} - A promise that resolves when the todo evaluation is saved.
 */
const createTodoEvalution = async (evalutionId,  todoEvalutionIds = []) => {
    const todoEvalution = todoEvalutionIds?.map((todoEvalutionId) => {
        const todoEvalution = todoEvalutionRepository.create({
            evalutionId: evalutionId,
            todoId: todoEvalutionId?.todoId,
            colorId: todoEvalutionId?.resultId
        });
        return todoEvalution;
    });
    // await milestoneService.updateIsEvaluted(milestoneId)
    return await todoEvalutionRepository.save(todoEvalution);
}
/**
 * Retrieves checklists.
 *
 * @async
 * @function
 * @returns {Promise} - A promise that resolves with the retrieved checklists.
 */
const getCheckLists = async () => {
    return await checkListRepository.find({ relations: ['milestone.criteria.todo', 'solution'] });
};
/**
 * Retrieves a checklist by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the checklist.
 * @returns {Promise} - A promise that resolves with the retrieved checklist.
 */
const getCheckList = async (id) => {
    return await checkListRepository.findOne({ where: { id: id }, relations: ['milestone.criteria.todo', 'solution'] });
};
/**
 * Retrieves checklists by milestone ID.
 *
 * @async
 * @function
 * @param {string} milestoenId - The ID of the milestone.
 * @returns {Promise} - A promise that resolves with the retrieved checklists.
 */
const getCheckListByMilestoneId = async (milestoenId) => {
    return await checkListRepository.find({ where: { milestoneId: milestoenId }, relations :["milestone.criteria.todo", "solution"] });
};
/**
 * Deletes a checklist by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the checklist to delete.
 * @returns {Promise} - A promise that resolves when the checklist is deleted.
 */
const deleteCheckList = async (id) => {
    return await checkListRepository.delete({ id: id });
};
/**
 * Updates a checklist by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the checklist to update.
 * @param {Object} body - The updated checklist data.
 * @returns {Promise} - A promise that resolves when the checklist is updated.
 */
const updateCheckList = async (id, body) => {
    return await checkListRepository.update({ id: id }, body);
};

module.exports = {
    createChecklist,
    createMilestoneCriteria,
    getCheckLists,
    getCheckList,
    deleteCheckList,
    updateCheckList,
    getCheckListByMilestoneId,
    createTodoEvalution
};
