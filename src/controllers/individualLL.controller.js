const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { individualLLService, lessonLearnedService } = require('../services');

const createIndividualLL = catchAsync(async (req, res) => {

    const checkLLId = await lessonLearnedService.getLLById(req.body.lessonLearnedId);
    if (!checkLLId) {
        return new ApiError(httpStatus.NOT_FOUND, 'Lesson learned Id Not Found');
    }
    const result = await individualLLService.createIndividualLL(req.body);
    res.status(httpStatus.CREATED).send(result);
});

const getIndividualLLs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await individualLLService.queryIndividualLLs(filter, options);
    res.send(result);
});

const getIndividualLLById = catchAsync(async (req, res) => {
    const result = await individualLLService.getIndividualLLById(req.params.individualLLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Individual Lesson learned not found');
    }
    res.send(result);
});

const updateIndividualLLById = catchAsync(async (req, res) => {
    const result = await individualLLService.updateIndividualLLById(req.params.individualLLId, req.body);
    res.send(result);
});

const deleteIndividualLLById = catchAsync(async (req, res) => {
    await individualLLService.deleteIndividualLLById(req.params.individualLLId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createIndividualLL,
    getIndividualLLs,
    getIndividualLLById,
    updateIndividualLLById,
    deleteIndividualLLById
};
