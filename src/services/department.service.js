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
 * @module department
 */
/**
 * Retrieves departments based on filter criteria and options.
 *
 * @async
 * @function
 * @param {Object} filter - The filter criteria for department retrieval.
 * @param {Object} options - Options for pagination and sorting.
 * @param {number} options.limit - The maximum number of departments to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort departments by.
 * @returns {Promise} - A promise that resolves with the retrieved departments.
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
 * Retrieves a department by its ID.
 *
 * @async
 * @function
 * @param {string} id - The ID of the department to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved department.
 */
const getDepartmentById = async (id) => {
    return await departmentRepository.findOne({ where: { id: id } });
};

module.exports = {
    queryDepartments,
    getDepartmentById
};
