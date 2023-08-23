

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { departmentService } = require('../services');



const getDepartments = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await departmentService.queryDepartments(filter, options);
    res.send(result);
});

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
