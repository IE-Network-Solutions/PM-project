const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lessonLearnedService } = require('../services');

const createLL = catchAsync(async (req, res) => {
    req.body.date = new Date().toString();
    console.log(req.body)
    const result = await lessonLearnedService.createLL(req.body);
    res.status(httpStatus.CREATED).send(result);
});

const getLLs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await lessonLearnedService.queryLLs(filter, options);
    res.send(result);
});


const getAllLLByProjectId = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByProjectId(req.params.projectId);
    console.log("result", result[0])
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id is not found');
    }
    res.send(result);
});

const getAllLLByDepartmentId = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByDepartmentId(req.params.departmentId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Department id is not found');
    }
    res.send(result);
});

const getLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getLLById(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});

const groupLLByProject = catchAsync(async (req, res) => {
    const LL = await lessonLearnedService.groupLLByProject();
    if (!LL) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL not found');
    }
    res.status(200).json({
        status: "Success",
        data: LL
    });
});

const updateLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.updateLLById(req.params.LLId, req.body);
    res.send(result);
});

const deleteLLById = catchAsync(async (req, res) => {
    await lessonLearnedService.deleteLLById(req.params.LLId);
    res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
    createLL,
    getLLs,
    getAllLLByProjectId,
    getAllLLByDepartmentId,
    getLLById,
    updateLLById,
    deleteLLById,
    groupLLByProject
};
