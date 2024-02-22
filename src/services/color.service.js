const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Color } = require('../models');

const colorRepository = dataSource.getRepository(Color).extend({
    findAll,
    sortBy,
});
/**
 * @module color
 */
/**
 * Creates a new color.
 *
 * @async
 * @function
 * @param {Object} body - The color data to create.
 * @returns {Promise} - A promise that resolves when the color is saved.
 */
const createColor = async (body) => {
    const color = await colorRepository.create(body);
    return await colorRepository.save(color);
};
/**
 * Retrieves colors.
 *
 * @async
 * @function
 * @returns {Promise} - A promise that resolves with the retrieved colors.
 */
const getColors = async () => {
    return await colorRepository.find();
};
/**
 * Retrieves a color by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the color to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved color.
 */
const getColor = async (id) => {
    return await colorRepository.findOne({ where: { id: id } });
};
/**
 * Deletes a color by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the color to delete.
 * @returns {Promise} - A promise that resolves when the color is deleted.
 */
const deleteColor = async (id) => {
    return await colorRepository.delete({ id: id });
};
/**
 * Updates a color by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the color to update.
 * @param {Object} body - The updated color data.
 * @returns {Promise} - A promise that resolves when the color is updated.
 */
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
