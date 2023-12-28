const httpStatus = require('http-status');
const { AfterActionAnalysis, AAADepartment, Department } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { createAction, getIssueRelatedById } = require('./action.service');
const { updateRelatedIssueById } = require('./relatedIssues.service');

const AAARepository = dataSource.getRepository(AfterActionAnalysis).extend({ findAll, sortBy });
const AAADepartmentRepository = dataSource.getRepository(AAADepartment).extend({ findAll, sortBy });
const DepartmentRepository = dataSource.getRepository(Department).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<AAA>}
 */
const createAAA = async (AAABody, departments) => {
    let relatedIssues = AAABody.issueRelatesId;
    const createdAAA = AAARepository.create(AAABody)
    const resultAAA = await AAARepository.save(createdAAA)

    if (departments) {
        const AAADeparmentInstance = departments.map((department) => {
            return AAADepartmentRepository.create({
                afterActionAnalysisId: createdAAA.id,
                departmentId: department,
            });
        });
        await AAADepartmentRepository.save(AAADeparmentInstance);
    }

    for (const ids of relatedIssues) {
        await updateRelatedIssueById(ids, { afterActionAnalysisId: resultAAA.id });
    }
    return await getAAAById(resultAAA.id);
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
        relations: ['actions.responsiblePerson', 'actions.authorizedPerson', 'issueRelates', 'project', 'department'],
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
    return await AAARepository.findOne({
        where: {
            id: id,
        },
        relations: ['actions.responsiblePerson', 'actions.authorizedPerson', "actions", 'issueRelates', 'project', 'department'],
        tableName: 'afterActionAnalysis'
    });
};

const groupAAAByProject = async (filter, options) => {
    const groupedResults = await AAARepository
        .createQueryBuilder('aaa')
        .leftJoinAndSelect('aaa.project', 'project')
        .select([
            'aaa.projectId AS projectId',
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
            'json_agg(aaa.*) AS AfterActionAnalysis',
        ])
        .groupBy('aaa.projectId, project.id, project.name')
        .getRawMany();

    return groupedResults;
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

    const issues = updateBody.issueRelatesId;
    const departments = updateBody.departments;

    delete updateBody.issueRelatesId;
    delete updateBody.departments;


    if (!issues || !departments) {
        await AAARepository.update({ id: AAAId }, updateBody);
        return await getAAAById(checkAAAId.id);
    }
    else {
        await AAARepository.update({ id: AAAId }, updateBody);
        for (const ids of issues) {
            await updateRelatedIssueById(ids, { afterActionAnalysisId: checkAAAId.id })
        };
        const existingRecord = await AAADepartmentRepository.find({
            where: { afterActionAnalysisId: checkAAAId.id },
        });
        await AAADepartmentRepository.delete(existingRecord);

        for (const departmentId of departments) {
            const updateDepartment = AAADepartmentRepository.create({
                afterActionAnalysisId: checkAAAId.id,
                departmentId: departmentId,
            });
            await AAADepartmentRepository.save(updateDepartment);
        }

        return await getAAAById(checkAAAId.id);
    }
};

/**
 * Delete user by id
 * @param {ObjectId} riskId
 * @returns {Promise<AAA>}
 */
const deleteAAAById = async (AAAId) => {
    const AAA = await getAAAById(AAAId);
    await AAADepartmentRepository.delete({ afterActionAnalysisId: AAA.id })
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    return await AAARepository.delete({ id: AAAId });
};

const getAllAAAByProjectId = async (id) => {
    return await AAARepository.find({
        where: { projectId: id },
        relations: ['actions.responsiblePerson', 'actions.authorizedPerson', 'issueRelates', 'project', 'department', 'accountablities.responsiblePerson'],
        tableName: 'afterActionAnalysis'
    });
};


module.exports = {
    createAAA,
    queryAAAs,
    getAAAById,
    updateAAAById,
    deleteAAAById,
    getAllAAAByProjectId,
    groupAAAByProject
};
