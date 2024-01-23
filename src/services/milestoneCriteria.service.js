const findAll = require('./Plugins/findAll');
const sortBy = require('../utils/sorter');
const dataSource = require('../utils/createDatabaseConnection');
const { MilestoneCriteria } = require('../models');

const milestoneCriteriaRepository = dataSource.getRepository(MilestoneCriteria).extend({ findAll, sortBy });

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

