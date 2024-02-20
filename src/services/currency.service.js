const httpStatus = require('http-status');
const { Currency } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const currencyRepository = dataSource.getRepository(Currency).extend({ findAll, sortBy });
/**
 * @module currency
 */
/**
 * Retrieves currencies based on filter criteria and options.
 *
 * @async
 * @function
 * @param {Object} filter - The filter criteria for currency retrieval.
 * @param {Object} options - Options for pagination and sorting.
 * @param {number} options.limit - The maximum number of currencies to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort currencies by.
 * @returns {Promise} - A promise that resolves with the retrieved currencies.
 */
const queryCurrency = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await currencyRepository.find({
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a currency by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the currency to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved currency.
 */
const getCurrencyById = async (id) => {
  return await currencyRepository.findOneBy({ id: id });
};



module.exports = {
  queryCurrency,
  getCurrencyById
};
