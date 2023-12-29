const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Criteria } = require('../models');

const criteriaRepository = dataSource.getRepository(Criteria).extend({ findAll, sortBy, });


const createCriteria = async (body) => {
    const solution = await criteriaRepository.create(body);
    return await criteriaRepository.save(solution);
};

const getCriterias = async () => {
    return await criteriaRepository.find({ relations: ['todo'] });
};

const getCriteria = async (id) => {
    return await criteriaRepository.findOne({ where: { id: id }, relations: ['todo'] });
};

const deleteCriteria = async (id) => {
    return await criteriaRepository.delete({ id: id });
};

const updateCriteria = async (id, body) => {
    return await criteriaRepository.update({ id: id }, body);
};

module.exports = {
    createCriteria,
    getCriterias,
    getCriteria,
    deleteCriteria,
    updateCriteria
};