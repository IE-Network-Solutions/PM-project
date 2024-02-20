const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {clientService} =require('../services')

/**
 * @module client
 */

/**
 * Retrieves all clients.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of clients.
 */
const getAllClients = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await clientService.getClients(filter, options);
    res.send(result);
});
module.exports={getAllClients};
