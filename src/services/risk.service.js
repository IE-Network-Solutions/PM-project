const httpStatus = require('http-status');
const { Risk } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const issueService = require('./issue.service');
const { Between, In } = require('typeorm');

const riskRepository = dataSource.getRepository(Risk).extend({ findAll, sortBy });
// .extend({ sortBy });
//
/**
 * @module risk
 */
/**
 * Creates a risk asynchronously.
 *
 * @function
 * @param {Object} riskBody - The risk data to be saved.
 * @returns {Promise<Object>} - A promise that resolves to the saved risk object.
 */
const createRisk = async (riskBody) => {
    const risk = riskRepository.create(riskBody);
    return await riskRepository.save(risk);
};
/**
 * Queries risks asynchronously.
 *
 * @function
 * @param {Object} filter - The filter criteria for risk data.
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of results to return.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of risk objects.
 */
const queryRisks = async (filter, options) => {
    const { limit, page, sortBy } = options;
    return await riskRepository.find({
        relations: ['project'],
        tableName: 'risk',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};
/**
 * Retrieves risks created within a specified date range.
 *
 * @function
 * @param {string} startDate - The start date in ISO format (e.g., '2024-02-15').
 * @param {string} endDate - The end date in ISO format (e.g., '2024-02-20').
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of risk objects.
 */
const getRisksByDate = async (startDate, endDate) => {

    return await riskRepository.find({
        where: {
            createdAt: Between(
                new Date(startDate).toISOString(),
                new Date(endDate).toISOString()
            ),
        },
        relations: ['project']
    });
};
/**
 * Retrieves all risks associated with a specific project ID.
 *
 * @function
 * @param {number} id - The project ID to filter risks.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of risk objects.
 */

const  getAllRisksByProjectId = async (id) => {
    return await riskRepository.find(
        {
            where: {
                projectId: id,
            },
            relations: ['project']
        });
};
/**
 * Retrieves all risks associated with a specific project ID within a specified date range.
 *
 * @function
 * @param {number} id - The project ID to filter risks.
 * @param {string[]} status - An array of risk statuses (e.g., ['open', 'in-progress']).
 * @param {string} startDate - The start date in ISO format (e.g., '2024-02-15').
 * @param {string} endDate - The end date in ISO format (e.g., '2024-02-20').
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of risk objects.
 */
const getAllRisksByProjectIdAndByDate = async (id, status, startDate, endDate) => {
    return await riskRepository.find(
        {
            where: {
                projectId: id,
                status: status[0],
                createdAt: Between(
                    new Date(startDate).toISOString(),
                    new Date(endDate).toISOString()
                ),
            },
            relations: ['project']
        });
};
/**
 * Retrieves a risk by its unique identifier.
 *
 * @function
 * @param {number} id - The ID of the risk to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the risk object or null if not found.
 */
const getRiskById = async (id) => {
    return await riskRepository.findOne(
        {
            where: {
                id: id,
            },
            relations: ['project']
        });
};
/**
 * Groups critical risks by project based on specified filter and options.
 * @function
 * @param {Object} filter - Filter criteria for risk selection.
 * @param {Object} options - Additional options for grouping.
 * @returns {Promise<Array>} - Resolves with an array of grouped results.
 */
const groupCriticalRiskByProject = async (filter, options) => {
    const groupedResults = await riskRepository
        .createQueryBuilder('cr')
        .leftJoinAndSelect('cr.project', 'project')
        .andWhere('(cr.riskRate = :rate OR cr.residualRiskRate = :rate)', { rate: 'Critical' })
        .select([
            'cr.projectId AS projectId',
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
            'json_agg(cr.*) AS Risks',
        ])
        .groupBy('cr.projectId, project.id, project.name')
        .getRawMany();

    return groupedResults;
};
/**
 * Groups critical risks associated with projects.
 *
 * @function
 * @param {Object} filter - The filter criteria for risk data.
 * @param {Object} options - Additional options for grouping.
 * @param {string} options.rate - The risk rate to filter by (e.g., 'Critical').
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of grouped risk objects.
 */
const getAllCriticalRisks = async (status) => {
    return await riskRepository.find(
        {
            where: {
                riskRate: "Critical",
            },
            relations: ['project']
        });
};
/**
 * Retrieves all critical risks.
 *
 * @function
 * @param {string} status - The status of the risks (e.g., 'open', 'in-progress').
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of critical risk objects.
 */
const updateRiskStatus = async (riskId, status) => {
    return await riskRepository.update({ id: "Transfered" })
};
/**
 * Updates a risk by its unique identifier.
 *
 * @function
 * @param {number} riskId - The ID of the risk to update.
 * @param {Object} updateBody - The updated risk data.
 * @returns {Promise<Object|null>} - A promise that resolves to the updated risk object or null if not found.
 * @throws {ApiError} - Throws an error if the risk with the specified ID is not found.
 */
const updateRiskById = async (riskId, updateBody) => {
    const risk = await getRiskById(riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    await riskRepository.update({ id: riskId }, updateBody);
    return await getRiskById(riskId);
};
/**
 * Deletes a risk by its unique identifier.
 *
 * @function
 * @param {number} riskId - The ID of the risk to delete.
 * @returns {Promise<void>} - A promise that resolves when the risk is successfully deleted.
 * @throws {ApiError} - Throws an error if the risk with the specified ID is not found.
 */
const deleteRiskById = async (riskId) => {
    const risk = await getRiskById(riskId);
    if (!risk) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Risk not found');
    }
    return await riskRepository.delete({ id: riskId });
};
/**
 * Retrieves all risks and issues associated with a specific project ID within a specified date range.
 *
 * @function
 * @param {number} projectId - The project ID to filter risks and issues.
 * @param {string} status - The status of the risks (e.g., 'open', 'in-progress').
 * @param {string} startDate - The start date in ISO format (e.g., '2024-02-15').
 * @param {string} endDate - The end date in ISO format (e.g., '2024-02-20').
 * @returns {Promise<Object>} - A promise that resolves to an object containing risks and issues.
 */
const getAllRiskAndIssuesByProjectIdByDate = async (projectId, status, startDate, endDate) => {
    const risksByProjectId = await getAllRisksByProjectIdAndByDate(projectId, status, startDate, endDate);
    const issuesByProjectId = await issueService.getAllIssuesByProjectIdAndByDate(projectId, "Transfered", startDate, endDate);
    return {
        Risks: risksByProjectId,
        Issues: issuesByProjectId
    };
};

module.exports = {
    createRisk,
    queryRisks,
    getRisksByDate,
    getRiskById,
    getAllRisksByProjectIdAndByDate,
    updateRiskById,
    deleteRiskById,
    updateRiskStatus,
    getAllCriticalRisks,
    getAllRiskAndIssuesByProjectIdByDate,
    getAllRisksByProjectId,
    groupCriticalRiskByProject
};
