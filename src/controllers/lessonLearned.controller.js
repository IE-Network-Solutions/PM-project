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


const getAllLLByProjectId = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllLLByProjectId(req.params.projectId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id is not found');
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

const updateLLById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.updateLLById(req.params.LLId, req.body);
    res.send(result);
});

const deleteLLById = catchAsync(async (req, res) => {
    await lessonLearnedService.deleteLLById(req.params.LLId);
    res.status(httpStatus.NO_CONTENT).send();
});

const approvalRequestByPM = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.approvalRequestByPM(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    if (result[0].status === "Pending") {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned is already on pending');
    }
    const pending = await lessonLearnedService.updateLLById(req.params.LLId, { status: "Pending" });
    res.send(pending);
});

const getPendingApprovalRequestByPMOMById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getPendingApprovalRequestByPMOMById(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});

const getAllPendingApprovalRequestByPMOM = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllPendingApprovalRequestByPMOM(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});

const approvalRequestByPMOM = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.approvalRequestByPMOM(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    if (result[0].status === "Pending") {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned is already on pending');
    }
    const pending = await lessonLearnedService.updateLLById(req.params.LLId, { status: "Pending" });
    res.send(pending);
});

const getPendingApprovalRequestByCEOById = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getPendingApprovalRequestByCEOById(req.params.LLId);
    res.send(result);
});

const getAllPendingApprovalRequestByCEO = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.getAllPendingApprovalRequestByCEO();
    res.send(result);
});

const approveByCEO = catchAsync(async (req, res) => {
    const result = await lessonLearnedService.approveByCEO(req.params.LLId);
    console.log(result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    if (result[0].status === "Approved") {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned is already on Approved');
    }
    const pending = await lessonLearnedService.updateLLById(req.params.LLId, { status: "Approved" });
    res.send(pending);
});

module.exports = {
    createLL,
    getLLs,
    getAllLLByProjectId,
    getLLById,
    updateLLById,
    deleteLLById,


    approvalRequestByPM,
    getPendingApprovalRequestByPMOMById,
    getAllPendingApprovalRequestByPMOM,
    approvalRequestByPMOM,
    getPendingApprovalRequestByCEOById,
    getAllPendingApprovalRequestByCEO,
    approveByCEO
};
