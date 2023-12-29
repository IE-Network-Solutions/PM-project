const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Solution } = require('../models');

const solutionRepository = dataSource.getRepository(Solution).extend({
    findAll,
    sortBy,
});

const createSolution = async (body) => {
    const solution = await solutionRepository.create(body);
    return await solutionRepository.save(solution);
};

const getSolutions = async () => {
    return await solutionRepository.find();
};

const getSolution = async (id) => {
    return await solutionRepository.findOne({ where: { id: id } });
};

const deleteSolution = async (id) => {
    return await solutionRepository.delete({ id: id });
};

const updateSolution = async (id, body) => {
    return await solutionRepository.update({ id: id }, body);
};



module.exports = {
    createSolution,
    getSolutions,
    getSolution,
    deleteSolution,
    updateSolution
};