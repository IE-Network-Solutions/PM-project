const httpStatus = require('http-status');
const { AfterActionAnalysis } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { createAction, getIssueRelatedById } = require('./action.service');
const { updateRelatedIssueById } = require('./relatedIssues.service');

const AAARepository = dataSource.getRepository(AfterActionAnalysis).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<AAA>}
 */
const createAAA = async (AAABody) => {

    let requestActions = AAABody.actions;
    let relatedIssues = AAABody.issueRelatesId;

    const createdAAA = AAARepository.create(AAABody)
    const resultAAA = await AAARepository.save(createdAAA);

    requestActions.forEach(async (action) => {
        action.afterActionAnalysis = createdAAA;
        await createAction(action);
    });
    relatedIssues.forEach(async (ids) => {
        await updateRelatedIssueById(ids, { afterActionAnalysisId: resultAAA.id });
    })
    console.log(await getAAAById(resultAAA.id));
    return getAAAById(resultAAA.id);
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

const queryAAAs = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await AAARepository.find({
        relations: ['actions', 'issueRelates', 'project'],
        tableName: 'afterActionAnalysis',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page }
    });
};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<AAA>}
 */
const getAAAById = async (id) => {
    return await AAARepository.find({
        where: {
            id: id,
        },
        relations: ['actions', 'issueRelates', 'project'],
        tableName: 'afterActionAnalysis'
    });
};

/**
 * Update user by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<AAA>}
 */
const updateAAAById = async (AAAId, updateBody) => {
    const checkAAAId = await getAAAById(AAAId);
    if (!checkAAAId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    let requestActions = updateBody.actions
    const result = await AAARepository.update({ id: AAAId }, updateBody);

    requestActions.map(async (action) => {
        action.afterActionAnalysis = result;
        await getIssueRelatedById(action);
    });

    return result;

    // return await getAAAById(AAAId);
};

/**
 * Delete user by id
 * @param {ObjectId} riskId
 * @returns {Promise<AAA>}
 */
const deleteAAAById = async (AAAId) => {
    const AAA = await getAAAById(AAAId);
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    return await AAARepository.delete({ id: AAAId });
};

const getAllAAAByProjectId = async (id) => {
    return await AAARepository.find({
        where: { projectId: id },
        relations: ['actions', 'issueRelates', 'project'],
        tableName: 'afterActionAnalysis'
    });
};


module.exports = {
    createAAA,
    queryAAAs,
    getAAAById,
    updateAAAById,
    deleteAAAById,
    getAllAAAByProjectId
};
