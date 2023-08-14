const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lessonLearnedService } = require('../services');

const createLL = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.createLL(req.body);
    res.status(httpStatus.CREATED).send(result);
});

const getLLs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await lessonLearnedService.queryLLs(filter, options);
    res.send(result);
});

const getLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getLLById(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});

const updateLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.updateLLById(req.params.LLId, req.body);
    res.send(result);
});

const deleteLLById = catchAsync(async (req, res) => {
    await lessonLearnedService.deleteLLById(req.params.LLId);
    res.status(httpStatus.NO_CONTENT).send();
});

const approvalRequestByPMOMLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.approvalRequestByPMOMLLById(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});

const getAllLLByPMOMById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByPMOMById(req.params.LLId, req.body);
    res.send(result);
});

const approvalRequestForCEO = catchAsync(async (req, res) => {
    await lessonLearnedService.approvalRequestForCEO(req.params.LLId);
    res.status(httpStatus.NO_CONTENT).send();
});

const getAllLLByCEO = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByCEO(req.params.LLId, req.body);
    res.send(result);
});

const approveLLByCEO = catchAsync(async (req, res) => {
    await lessonLearnedService.approveLLByCEO(req.params.LLId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createLL,
    getLLs,
    getLLById,
    updateLLById,
    deleteLLById,

    approvalRequestByPMOMLLById,
    getAllLLByPMOMById,
    approvalRequestForCEO,
    getAllLLByCEO,
    approveLLByCEO

};
