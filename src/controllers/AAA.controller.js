const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const teamList = require('../utils/teamList');
const { AfterActionAnalysisService } = require('../services');

const createAAA = catchAsync(async (req, res) => {
    const departments = req.body.departments;
    const AAA = await AfterActionAnalysisService.createAAA(req.body, departments);
    res.status(httpStatus.CREATED).send(AAA);
});

const getAAAs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await AfterActionAnalysisService.queryAAAs(filter, options);
    res.send(result);
});

const getAAA = catchAsync(async (req, res) => {
    const AAA = await AfterActionAnalysisService.getAAAById(req.params.AAAId);
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    res.status(200).json({
        status: "Success",
        data: AAA
    });
});

const groupAAAByProject = catchAsync(async (req, res) => {
    const AAA = await AfterActionAnalysisService.groupAAAByProject();
    if (!AAA) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AAA not found');
    }
    res.status(200).json({
        status: "Success",
        data: AAA
    });
});

const updateAAAById = catchAsync(async (req, res) => {
    const AAA = await AfterActionAnalysisService.updateAAAById(req.params.AAAId, req.body);
    res.send(AAA);
});

const deleteAAAById = catchAsync(async (req, res) => {
    await AfterActionAnalysisService.deleteAAAById(req.params.AAAId);
    res.status(httpStatus.NO_CONTENT).send();
});

const getAllAAAByProjectId = catchAsync(async (req, res) => {
    const result = await AfterActionAnalysisService.getAllAAAByProjectId(req.params.projectId);
    if (!result) {
        throw new ApiError(httpStatus.NO_CONTENT, "Project id Not Found")
    }
    // console.log(result)
    // console.log(req.params.projectId)
    res.send(result)
});


module.exports = {
    createAAA,
    getAAAs,
    getAAA,
    updateAAAById,
    deleteAAAById,
    getAllAAAByProjectId,
    groupAAAByProject
};
