const catchAsync = require("../utils/catchAsync");
const { Solution } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const createSolution = catchAsync(async (req, res, next) => {
    const solution = await Solution.createSolution(req.body);
    res.status(httpStatus.CREATED).send(solution);
})

const getSolutions = catchAsync(async (req, res, next) => {
    const solution = await Solution.getSolutions();
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    res.send(solution);
})

const getSolution = catchAsync(async (req, res, next) => {
    const solution = await Solution.getSolution(req.params.id);
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    res.send(solution);
})

const deleteSolution = catchAsync(async (req, res) => {
    const solution = await Solution.getSolution(req.params.id);
    console.log("solution id", solution)
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    await Solution.deleteSolution(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

const updateSolution = catchAsync(async (req, res) => {
    const solution = await Solution.getSolution(req.params.id);
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    await Solution.deleteSolution(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

module.exports = {
    createSolution,
    getSolutions,
    getSolution,
    deleteSolution,
    updateSolution
}