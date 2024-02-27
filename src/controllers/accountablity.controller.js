const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { accountablityService } = require('../services');

/**
 * @module accountability
 */
/**
 * Create a new accountability by associating with the AAA
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Array} req.body.accountabilities - Array of accountability objects
 * @param {string} req.body.afterActionAnalysisId - The ID of the after action analysis
 * @param {Object} res - Express response object
 */
const createAccountablity = catchAsync(async (req, res) => {
    const accountablities = await Promise.all(req.body?.accountablities?.map(async (element) => {
        const accountablity = await accountablityService.createAccountablity(element, req.body.afterActionAnalysisId);

        return accountablity;

    }));


    res.status(httpStatus.CREATED).send(accountablities);
});

/**
 * Get accountablities by query
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {Object} res - Express response object
 */
const getAccountablities = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await accountablityService.queryAccountablities(filter, options);
    res.send(result);
});

/**
 * Get accountability by ID
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.accId - Accountability ID
 * @param {Object} res - Express response object
 * @throws {ApiError}
 */
const getAccountablityById = catchAsync(async (req, res) => {
    const action = await accountablityService.getAccountablityById(req.params.accId);
    if (!action) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
    }
    res.send(action);
});

/**
 * Update accountablity by ID
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.accId - Accountability ID
 * @param {Object} req.body - Request body
 * @param {Object} res - Express response object
 */
const updateAccountablityById = catchAsync(async (req, res) => {
    const action = await accountablityService.updateAccountablityById(req.params.accId, req.body);
    res.send(action);
});

/**
 * Delete accountablity by ID
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.accId - Accountablity ID
 * @param {Object} res - Express response object
 */
const deleteAccountablityById = catchAsync(async (req, res) => {

    await accountablityService.deleteAccountablityById(req.params.accId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createAccountablity,
    getAccountablities,
    getAccountablityById,
    updateAccountablityById,
    deleteAccountablityById
};
