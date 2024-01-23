const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Color } = require('../models');

const colorRepository = dataSource.getRepository(Color).extend({
    findAll,
    sortBy,
});

const createColor = async (body) => {
    const color = await colorRepository.create(body);
    return await colorRepository.save(color);
};

const getColors = async () => {
    return await colorRepository.find();
};

const getColor = async (id) => {
    return await colorRepository.findOne({ where: { id: id } });
};

const deleteColor = async (id) => {
    return await colorRepository.delete({ id: id });
};

const updateColor = async (id, body) => {
    return await colorRepository.update({ id: id }, body);
};

module.exports = {
    createColor,
    getColors,
    getColor,
    deleteColor,
    updateColor
};