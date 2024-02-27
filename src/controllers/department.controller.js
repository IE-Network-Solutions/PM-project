

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { departmentService } = require('../services');

/**
 * @module department
 */
/**
 * Retrieves all departments based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all departments.
 */
const getDepartments = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await departmentService.queryDepartments(filter, options);
    res.send(result);
});
/**
 * Retrieves a department by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the department corresponding to the provided ID.
 * @throws {ApiError} If the department with the provided ID is not found.
 */
const getDepartmentById = catchAsync(async (req, res) => {
    const department = await departmentService.getDepartmentById(req.params.departmentId);
    if (!department) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
    }
    res.send(department);
});


module.exports = {
    getDepartmentById, getDepartments
};
