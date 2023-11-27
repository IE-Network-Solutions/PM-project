const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');


const getRoles = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await roleService.getRoles(filter, options);
    res.send(result);
});


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
