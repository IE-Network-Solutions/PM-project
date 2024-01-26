const catchAsync = require("../utils/catchAsync");
const { CheckList, milestoneService } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const createChecklist = catchAsync(async (req, res, next) => {
    const milestoneId = req.body.milestoneId;
    const criteriaIds = req.body.criteriaIds;
    console.log("req", req.body)

    const checkList1 = await CheckList.createChecklist(req.body);
    const checkList2 = await CheckList.createMilestoneCriteria(milestoneId, criteriaIds); 
    if (checkList1 && checkList2) {
        await milestoneService.updateHasCheckList(milestoneId)
        const checkListResult = await CheckList.getCheckList(checkList1?.id);
        res.status(httpStatus.CREATED).send(checkListResult);    
    }
})

const getCheckLists = catchAsync(async (req, res, next) => {
    const checkList = await CheckList.getCheckLists();
    if (!checkList) {
        return new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    res.send(checkList);
})

const getCheckList = catchAsync(async (req, res, next) => {
    const checkList = await CheckList.getCheckList(req.params.id);
    if (!checkList) {
        return new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    res.send(checkList);
})

const getCheckListByMilestoneId = catchAsync(async (req, res, next) => {
    const checkList = await CheckList.getCheckListByMilestoneId(req.params.id);
    if (!checkList) {
        return new ApiError(httpStatus.NOT_FOUND, 'Milestone NOT FOUND');
    }
    res.send(checkList);
})

const deleteCheckList = catchAsync(async (req, res) => {
    const checkList = await CheckList.getCheckList(req.params.id);
    if (!checkList) {
        throw new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    await CheckList.deleteCheckList(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

const updateCheckList = catchAsync(async (req, res) => {
    const checkList = await CheckList.updateCheckList(req.params.id);
    if (!checkList) {
        throw new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    await CheckList.updateCheckList(req.params.id);
    res.status(httpStatus.OK).send("Successfully Updated");
})

module.exports = {
    createChecklist,
    getCheckLists,
    getCheckList,
    deleteCheckList,
    updateCheckList,
    getCheckListByMilestoneId
}