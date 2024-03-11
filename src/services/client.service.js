/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { Client } = require('../models')
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const clientRepository = dataSource.getRepository(Client).extend({ findAll, sortBy });
/**
 * @module client
*/
/**
 * Retrieves clients based on filter criteria and options.
 *
 * @async
 * @function
 * @param {Object} filter - The filter criteria for client retrieval.
 * @param {Object} options - Options for pagination and sorting.
 * @param {number} options.limit - The maximum number of clients to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort clients by.
 * @returns {Promise} - A promise that resolves with the retrieved clients.
 */
const getClients = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await clientRepository.find({

        tableName: 'clients',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};

const createClient = async (clientData) => {
    let client = await clientRepository.create(clientData);

    return await clientRepository.save(client);
}
module.exports = {
    getClients,
    createClient
};
