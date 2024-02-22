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
 * @module AAA
 */
/**
 * Creates and saves an AAA instance and its related entities
 * @function
 * @param {Object} AAABody - The body of the AAA instance
 * @param {Array<number>} [departments] - The optional array of department IDs
 * @returns {Promise<Object>} - The created AAA instance with its related entities
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
 * Queries and returns the AAA instances that match the filter and options
 * @function
 * @param {Object} filter - The filter object for the query
 * @param {Object} options - The options object for the query
 * @param {number} options.limit - The maximum number of results to return
 * @param {number} options.page - The page number of the results
 * @param {string} [options.sortBy] - The optional sorting option for the results
 * @returns {Promise<Array<Object>>} - The array of AAA instances with their related entities
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
 * Gets and returns an AAA instance by its ID
 * @function
 * @param {number} id - The ID of the AAA instance
 * @returns {Promise<Object>} - The AAA instance with its related entities
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
/**
 * Queries and returns the AAA instances that match the filter and options
 * @function
 * @param {Object} filter - The filter object for the query
 * @param {Object} options - The options object for the query
 * @param {number} options.limit - The maximum number of results to return
 * @param {number} options.page - The page number of the results
 * @param {string} [options.sortBy] - The optional sorting option for the results
 * @returns {Promise<Array<Object>>} - The array of AAA instances with their related entities
 */
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
 * Updates and returns an AAA instance by its ID and the update body
 * @function
 * @param {number} AAAId - The ID of the AAA instance to update
 * @param {Object} updateBody - The update body for the AAA instance
 * @param {Array<number>} [updateBody.issueRelatesId] - The optional array of related issue IDs
 * @param {Array<number>} [updateBody.departments] - The optional array of department IDs
 * @returns {Promise<Object>} - The updated AAA instance with its related entities
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
 * Deletes an AAA instance by its ID and its related entities
 * @function
 * @param {number} AAAId - The ID of the AAA instance to delete
 * @returns {Promise<Object>} - The deleted AAA instance
 */
const deleteAAAById = async (AAAId) => {
    const AAA = await getAAAById(AAAId);
    await AAADepartmentRepository.delete({ afterActionAnalysisId: AAA.id })
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    return await AAARepository.delete({ id: AAAId });
};
/**
 * Gets and returns all the AAA instances by the project ID
 * @function
 * @param {number} id - The ID of the project
 * @returns {Promise<Array<Object>>} - The array of AAA instances with their related entities
 */
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
