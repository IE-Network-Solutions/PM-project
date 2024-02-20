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
 * @module lessonLearned
*/
/**
 * Creates a lesson learned record.
 * @async
 * @function
 * @param {Object} LLBody - The data for the lesson learned.
 * @returns {Promise<Object>} - A promise resolving to the saved lesson learned record.
 */
const createLL = async (LLBody) => {
    const result = lessonLearnedRepository.create(LLBody);
    return await lessonLearnedRepository.save(result);
};
/**
 * Retrieves lesson learned data, including related individuals, comments, project, and department.
 * @async
 * @function
 * @param {Object} filter - The filter criteria for querying lesson learned records.
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of records to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<Object[]>} - A promise resolving to an array of lesson learned records.
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
/**
 * Retrieves lesson learned data related to a specific project.
 * @async
 * @function
 * @param {number} id - The ID of the project.
 * @returns {Promise<Object[]>} - A promise resolving to an array of lesson learned records associated with the project.
 */
const getAllLLByProjectId = async (id) => {
    return await lessonLearnedRepository.find(
        {
            where: { projectId: id },
            relations: ['individuals', 'llComments', 'project', 'department']
        });
};
/**
 * Retrieves lesson learned data related to a specific department.
 * @async
 * @function
 * @param {number} id - The ID of the department.
 * @returns {Promise<Object[]>} - A promise resolving to an array of lesson learned records associated with the department.
 */
const getAllLLByDepartmentId = async (id) => {
    return await lessonLearnedRepository.find(
        {
            where: { departmentId: id },
            relations: ['individuals', 'llComments', 'project', 'department']
        });
};
/**
 * Retrieves a lesson learned record by its ID.
 * @async
 * @param {number} id - The ID of the lesson learned.
 * @returns {Promise<Object>} - A promise resolving to the retrieved lesson learned record.
 */
const getLLById = async (id) => {
    return await lessonLearnedRepository.findOne(
        {
            where: { id: id },
            relations: ['individuals', 'llComments', 'project', 'department']
        });
};
/**
 * Returns all lesson learned entries associated with a given project
 * @function
 * @param {Object} filter - The filter criteria.
 * @param {Object} options - Additional options.
 * @returns {Promise<Array>} - A promise that resolves to an array of grouped results.
 */
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
 * Updates a lesson learned entry using the ID
 * @function
 * @param {string} LLId - The ID of the lesson learned.
 * @param {Object} updateBody - The update data for the lesson learned.
 * @throws {ApiError} Throws an error if the lesson learned is not found.
 * @returns {Promise<Object>} - A promise that resolves to the updated lesson learned.
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
 * Deletes a lesson learned entry uing its ID
 * @function
 * @param {string} LLId - The ID of the lesson learned.
 * @throws {ApiError} Throws an error if the lesson learned is not found.
 * @returns {Promise<Object>} - A promise that resolves when the lesson learned is successfully deleted.
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
