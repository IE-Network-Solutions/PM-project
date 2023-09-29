/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const {Client} = require('../models')
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const clientRepository = dataSource.getRepository(Client).extend({ findAll, sortBy });

/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getClients = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await clientRepository.find({
       
        tableName: 'clients',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};
module.exports={
    getClients
};
