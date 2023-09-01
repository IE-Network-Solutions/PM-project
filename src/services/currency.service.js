const httpStatus = require('http-status');
const { Currency } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const currencyRepository = dataSource.getRepository(Currency).extend({ findAll, sortBy });

/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryCurrency = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await currencyRepository.findAll({
    tableName: 'currency',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Currency>}
 */
const getCurrencyById = async (id) => {
  return await currencyRepository.findOneBy({ id: id });
};



module.exports = {
  queryCurrency,
  getCurrencyById
};
