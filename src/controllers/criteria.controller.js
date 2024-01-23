const catchAsync = require("../utils/catchAsync");
const { Criteria } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const createCriteria = catchAsync(async (req, res, next) => {
    const criteria = await Criteria.createCriteria(req.body);
    res.status(httpStatus.CREATED).send(criteria);
})

const getCriterias = catchAsync(async (req, res, next) => {
    const criteria = await Criteria.getCriterias();
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    res.send(criteria);
})

const getCriteria = catchAsync(async (req, res, next) => {
    const criteria = await Criteria.getCriteria(req.params.id);
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    res.send(criteria);
})

const deleteCriteria = catchAsync(async (req, res) => {
    const criteria = await Criteria.getCriteria(req.params.id);
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    await Criteria.deleteCriteria(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

const updateCriteria = catchAsync(async (req, res) => {
    const criteria = await Criteria.getCriteria(req.params.id);
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    await Criteria.updateCriteria(req.params.id);
    res.status(httpStatus.OK).send("Successfully Updated");
})

module.exports = {
    createCriteria,
    getCriterias,
    getCriteria,
    deleteCriteria,
    updateCriteria
}