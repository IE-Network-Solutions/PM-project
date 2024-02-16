const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');

/**
 * @module role
 */
/**
 * Retrieves roles based on filter and pagination options.
 * @function
 * @param {Object} req.query - The query parameters for filtering and pagination.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the roles are retrieved.
 * @throws {Error} - If there's an issue fetching the roles.
 */
const getRoles = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await roleService.getRoles(filter, options);
    res.send(result);
});

/**
 * Retrieves a specific role by its ID.
 * @function
 * @param {Object} req.params.roleId - The ID of the role.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the role is retrieved.
 * @throws {Error} - If the role is not found.
 */
const getRole = catchAsync(async (req, res) => {
    const user = await roleService.getRole(req.params.roleId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});


module.exports = {
    getRoles,
    getRole
};
