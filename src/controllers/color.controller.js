const catchAsync = require("../utils/catchAsync");
const { Color } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const createColor = catchAsync(async (req, res, next) => {
    const color = await Color.createColor(req.body);
    res.status(httpStatus.CREATED).send(color);
})

const getColors = catchAsync(async (req, res, next) => {
    const color = await Color.getColors();
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    res.send(color);
})

const getColor = catchAsync(async (req, res, next) => {
    const color = await Color.getColor(req.params.id);
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    res.send(color);
})

const deleteColor = catchAsync(async (req, res) => {
    const color = await Criteria.getCriteria(req.params.id);
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    await Color.deleteColor(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

const updateColor = catchAsync(async (req, res) => {
    const color = await Criteria.getCriteria(req.params.id);
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    await Color.updateColor(req.params.id);
    res.status(httpStatus.OK).send("Successfully Updated");
})

module.exports = {
    createColor,
    getColors,
    getColor,
    deleteColor,
    updateColor
}