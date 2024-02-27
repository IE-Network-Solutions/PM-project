const sortBy = require('./Plugins/findAll')
const findAll = require('./Plugins/findAll');
const { Evalution, TodoEvalution, Color, CheckList } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');

const evalutionRepository = dataSource.getRepository(Evalution).extend({ findAll, sortBy });
const todoEvalutionRepository = dataSource.getRepository(TodoEvalution).extend({ findAll, sortBy });
const checkListRepository = dataSource.getRepository(CheckList).extend({ findAll, sortBy });
/**
 * @module evaluation
*/
/**
 * Creates an evaluation.
 *
 * @async
 * @function
 * @param {string} checkListId - The ID of the checklist associated with the evaluation.
 * @returns {Promise} - A promise that resolves when the evaluation is saved.
 */
const createEvalution = async (checkListId) => {
    const evalution = await evalutionRepository.create({ checkListId: checkListId });
    return await evalutionRepository.save(evalution);
}
/**
 * Retrieves an evaluation and associated todo evaluation by evaluation ID.
 *
 * @async
 * @function
 * @param {string} evalutionId - The ID of the evaluation to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved evaluation and todo evaluation.
 */
const getEvalution = async (evalutionId) => {
    const evalution = await evalutionRepository.find({ where: { id: evalutionId }, relations: ['checkList.milestone.criteria.todo'] });
    const todoEvalution = await todoEvalutionRepository.findOne( {where : {evalutionId : evalutionId}, relations:['evalution']});
    return {
        evalution, todoEvalution
    };
}
/**
 * Retrieves evaluation data, including checklist and todo evaluation details.
 * @async
 * @function
 * @returns {Promise<{ evalution: any[], todoEvalution: any[] }>} - A promise resolving to an object containing evaluation and todo evaluation arrays.
 */
const getEvalutions = async () => {
    const evalution = await evalutionRepository.find({ relations: ['checkList.milestone.criteria.todo'] });
    const todoEvalution = await todoEvalutionRepository.find();
    return {
        evalution, todoEvalution
    };
}
/**
 * Retrieves evaluations and associated todo evaluations by milestone ID.
 *
 * @async
 * @function
 * @param {string} milestoenId - The ID of the milestone.
 * @returns {Promise} - A promise that resolves with the retrieved evaluations and todo evaluations.
 */
const getEvalutionByMilestoneId = async (milestoenId) => {
    const container = [];
    const evalution = await checkListRepository.findOne({ where: { milestoneId: milestoenId }, relations: ['milestone.criteria.todo'] });
    const evalutionId = await evalutionRepository.findOne({ where: { checkListId: evalution?.id } });
    const todoEvalution = await todoEvalutionRepository.find({where : { evalutionId: evalutionId?.id}});

     todoEvalution?.map((todo) => {
        evalution?.milestone?.criteria?.map((criteria) => {
            return criteria?.todo?.map((todoEvalution) => {
                if (todo?.todoId === todoEvalution?.id) {
                    container.push(todoEvalution)
                }
            })
        })
     })

    // const todoMap = new Map(container.map(todo => [todo.id, todo]));

    // const todoEvalutionWithTodo = todoEvalution?.map(entry => {
    //     const todoEntry = todoMap.get(entry.todoId);
    //     return {
    //         todo: {
    //             id: todoEntry?.id,
    //             createdAt: todoEntry?.createdAt,
    //             updatedAt: todoEntry?.updatedAt,
    //             createdBy: todoEntry?.createdBy,
    //             updatedBy: todoEntry?.updatedBy,
    //             name: todoEntry?.name,
    //             criteriaId: todoEntry?.criteriaId,
    //             evalution: {
    //                 evalutionId: entry.evalutionId,
    //                 colorId: entry.colorId,
    //                 todoId: entry.todoId,
    //             },
    //         },
    //     };
    // });
    return {
         evalution, todoEvalution
    };
}
/**
 * Deletes an evaluation and associated todo evaluations by evaluation ID.
 *
 * @async
 * @function
 * @param {string} evalutionId - The ID of the evaluation to delete.
 * @returns {Promise} - A promise that resolves when the evaluation and associated todo evaluations are removed.
 */
const deleteEvalutionById = async (evalutionId) => {
    const todoEvalution = await todoEvalutionRepository.find({ where: { evalutionId: evalutionId } });
    return await todoEvalutionRepository.remove(todoEvalution);
};
/**
 * Updates evaluation data based on checklist and todo evaluation IDs.
 * @async
 * @function
 * @param {number} checkListId - The ID of the checklist.
 * @param {number[]} todoEvalutionIds - An array of todo evaluation IDs.
 * @returns {Promise<any[]>} - A promise resolving to an array of updated evaluation results.
 */
const updateEvalution = async (checkListId, todoEvalutionIds = []) => {
    const checkList = await evalutionRepository.findOne({ where: { checkListId: checkListId } });
    const todoEvalution = await todoEvalutionRepository.find({ where: { evalutionId: checkList.id } });

    await Promise.all(todoEvalution.map(async (todoEva) => {
        await deleteEvalutionById(todoEva.evalutionId);
    }));

    const result = await Promise.all(todoEvalutionIds?.map(async (todoEvalutionId) => {
        const todoEvalution = todoEvalutionRepository.create({
            evalutionId: checkList.id,
            todoId: todoEvalutionId?.todoId,
            colorId: todoEvalutionId?.resultId
        });
        return await todoEvalutionRepository.save(todoEvalution);
    }));
    return result;
};

module.exports = {
    createEvalution,
    getEvalution,
    getEvalutions,
    getEvalutionByMilestoneId,
    updateEvalution,
}

