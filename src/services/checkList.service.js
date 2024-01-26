const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const dataSource = require('../utils/createDatabaseConnection');
const { CheckList, MilestoneCriteria, TodoEvalution } = require('../models');
const { milestoneService } = require('../services');

const checkListRepository = dataSource.getRepository(CheckList).extend({ findAll, sortBy });
const milestoneCriteriaRepository = dataSource.getRepository(MilestoneCriteria).extend({ findAll, sortBy });
const todoEvalutionRepository = dataSource.getRepository(TodoEvalution).extend({ findAll, sortBy });


const createChecklist = async (body) => {
    const checkList = await checkListRepository.create({
        name: body.name,
        milestoneId: body.milestoneId,
        solutionId: body.solutionId
    });
    return await checkListRepository.save(checkList);
};

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

const getCheckLists = async () => {
    return await checkListRepository.find({ relations: ['milestone.criteria.todo', 'solution'] });
};

const getCheckList = async (id) => {
    return await checkListRepository.findOne({ where: { id: id }, relations: ['milestone.criteria.todo', 'solution'] });
};

const getCheckListByMilestoneId = async (milestoenId) => {
    return await checkListRepository.find({ where: { milestoneId: milestoenId }, relations :["milestone.criteria.todo", "solution"] });
};

const deleteCheckList = async (id) => {
    return await checkListRepository.delete({ id: id });
};

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