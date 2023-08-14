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
        relations: ['individuals'],
        tableName: 'lessonLearned',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<LessonLearned>}
 */
const getLLById = async (id) => {
    return await lessonLearnedRepository.find({ where: { id: id }, relations: ['individuals'] });
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
const deleteLLById = async (issueId) => {
    const result = await getLLById();
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    return await lessonLearnedRepository.delete({ id: issueId });
};

//Addional API's for listing and approval requests by different levels [CEO, PMOM]
const approvalRequestByPMOMLLById = async (LLId) => {
    return await lessonLearnedRepository.find({
        where: { id: LLId },
        relations: ['individuals']
    })
}
const getAllLLByPMOMById = async (LLId) => {
    return await lessonLearnedRepository.find({
        where: { id: id },
        relations: ['individuals']
    });
}
const approvalRequestForCEO = async (LLId) => {

}
const getAllLLByCEO = async (LLId) => {
    return await lessonLearnedRepository.find({
        where: { id: id },
        relations: ['individuals']
    });
}
const approveLLByCEO = async (LLId) => {

}


module.exports = {
    createLL,
    queryLLs,
    getLLById,
    updateLLById,
    deleteLLById,

    approvalRequestByPMOMLLById,
    getAllLLByPMOMById,
    approvalRequestForCEO,
    getAllLLByCEO,
    approveLLByCEO
};
