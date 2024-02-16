const findAll = require('./Plugins/findAll');
const sortBy = require('../utils/sorter');
const dataSource = require('../utils/createDatabaseConnection');
const { MilestoneCriteria } = require('../models');

const milestoneCriteriaRepository = dataSource.getRepository(MilestoneCriteria).extend({ findAll, sortBy });
/**
 * @module milestoneCriteria
 */
/**
 * This function creates and saves milestone criteria based on the provided milestone ID and an array of criteria IDs.
 * @function
 * @param {string} milestoenId - The ID of the milestone.
 * @param {Array<string>} criteriaIds - An array of criteria IDs.
 * @throws {Error} Throws an error if there's an issue creating or saving milestone criteria.
 * @returns {Promise<Array>} - A promise that resolves to an array of saved milestone criteria.
 */
const createMilestoneCriteria = async (milestoenId, criteriaIds = []) => {
    const milestoneCriteria = criteriaIds?.map(async (criteriaId) => {
        return await milestoneCriteriaRepository.create({
            milestoneId: milestoenId,
            criteriaId: criteriaId
        });
    })
    return await milestoneCriteriaRepository.save(milestoneCriteria);
}

module.exports = {
    createMilestoneCriteria
}

