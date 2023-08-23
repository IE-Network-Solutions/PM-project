const httpStatus = require('http-status');
const { Department } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');


const departmentRepository = dataSource.getRepository(Department).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Query for department
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryDepartments = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await departmentRepository.find({
        tableName: 'department',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};

/**
 * Get department by id
 * @param {ObjectId} id
 * @returns {Promise<Issue>}
 */
const getDepartmentById = async (id) => {
    return await departmentRepository.findOne({ where: { id: id } });
};

module.exports = {
    queryDepartments,
    getDepartmentById
};
