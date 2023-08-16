const httpStatus = require('http-status');
const { User } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const userRepository = dataSource.getRepository(User).extend({ findAll, sortBy });



/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryUsers = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await userRepository.findAll({
        tableName: 'user',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};


/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Risk>}
 */
const getUserById = async (id) => {
    return await userRepository.findOneBy({ id: id });
};

module.exports = {
    queryUsers,
    getUserById
};
