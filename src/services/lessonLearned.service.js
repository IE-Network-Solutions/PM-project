const httpStatus = require('http-status');
const { LessonLearned } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const lessonLearnedRepository = dataSource.getRepository(LessonLearned).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<LessonLearned>}
 */
const createLL = async (LLBody) => {
    const result = lessonLearnedRepository.create(LLBody);
    return await lessonLearnedRepository.save(result);
};

/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryLLs = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await lessonLearnedRepository.find({
        relations: ['individuals', 'llComments', 'project', 'department'],
        tableName: 'lessonLearned',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};

const getAllLLByProjectId = async (id) => {
    return await lessonLearnedRepository.find(
        {
            where: { projectId: id },
            relations: ['individuals', 'llComments', 'project', 'department']
        });
};

const getAllLLByDepartmentId = async (id) => {
    return await lessonLearnedRepository.find(
        {
            where: { departmentId: id },
            relations: ['individuals', 'llComments', 'project', 'department']
        });
};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<LessonLearned>}
 */
const getLLById = async (id) => {
    return await lessonLearnedRepository.findOne(
        {
            where: { id: id },
            relations: ['individuals', 'llComments', 'project', 'department']
        });
};

const groupLLByProject = async (filter, options) => {
    const groupedResults = await lessonLearnedRepository
        .createQueryBuilder('ll')
        .leftJoinAndSelect('ll.project', 'project')
        .select([
            'll.projectId AS projectId',
            'project.createdAt AS createdAt',
            'project.updatedAt AS updatedAt',
            'project.createdBy AS createdBy',
            'project.updatedBy AS updatedBy',
            'project.name AS name',
            'project.clientId AS clientId',
            'project.milestone AS _milestone',
            'project.budget AS budget',
            'project.contract_sign_date AS contract_sign_date',
            'project.planned_end_date AS planned_end_date',
            'project.lc_opening_date AS lc_opening_date',
            'project.advanced_payment_date AS advanced_payment_date',
            'project.status AS status',
            'json_agg(ll.*) AS LessonLearned',
        ])
        .groupBy('ll.projectId, project.id, project.name')
        .getRawMany();

    return groupedResults;
};

/**
 * Update user by id
 * @param {ObjectId} issueId
 * @param {Object} updateBody
 * @returns {Promise<LessonLearned>}
 */
const updateLLById = async (LLId, updateBody) => {
    const result = await getLLById(LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    await lessonLearnedRepository.update({ id: LLId }, updateBody);
    return await getLLById(LLId);
};

/**
 * Delete user by id
 * @param {ObjectId} issueId
 * @returns {Promise<LessonLearned>}
 */
const deleteLLById = async (LLId) => {
    const result = await getLLById(LLId);
    console.log(result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    return await lessonLearnedRepository.delete({ id: LLId });
};


module.exports = {
    createLL,
    queryLLs,
    getAllLLByProjectId,
    getAllLLByDepartmentId,
    getLLById,
    updateLLById,
    deleteLLById,
    groupLLByProject

};
