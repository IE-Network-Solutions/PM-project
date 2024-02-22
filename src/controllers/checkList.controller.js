const catchAsync = require("../utils/catchAsync");
const { CheckList, milestoneService } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * @module checkList
 */

/**
 * Creates a new checklist.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created checklist.
 * @throws {ApiError} - Throws an error if the checklist cannot be created.
 */
const createChecklist = catchAsync(async (req, res, next) => {
    const milestoneId = req.body.milestoneId;
    const criteriaIds = req.body.criteriaIds;

    const checkList1 = await CheckList.createChecklist(req.body);
    const checkList2 = await CheckList.createMilestoneCriteria(milestoneId, criteriaIds);
    if (checkList1 && checkList2) {
        await milestoneService.updateHasCheckList(milestoneId)
        const checkListResult = await CheckList.getCheckList(checkList1?.id);
        res.status(httpStatus.CREATED).send(checkListResult);
    }
})
/**
 * Retrieves all checklists.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of checklists.
 * @throws {ApiError} - Throws an error if no checklists are found.
 */
const getCheckLists = catchAsync(async (req, res, next) => {
    const checkList = await CheckList.getCheckLists();
    if (!checkList) {
        return new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    res.send(checkList);
})
/**
 * Retrieves a specific checklist by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested checklist.
 * @throws {ApiError} - Throws an error if the checklist is not found.
 */
const getCheckList = catchAsync(async (req, res, next) => {
    const checkList = await CheckList.getCheckList(req.params.id);
    if (!checkList) {
        return new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    res.send(checkList);
})
/**
 * Retrieves the checklist associated with a milestone ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the checklist for the specified milestone.
 * @throws {ApiError} - Throws an error if the milestone is not found.
 */
const getCheckListByMilestoneId = catchAsync(async (req, res, next) => {
    const checkList = await CheckList.getCheckListByMilestoneId(req.params.id);
    if (!checkList) {
        return new ApiError(httpStatus.NOT_FOUND, 'Milestone NOT FOUND');
    }
    res.send(checkList);
})
/**
 * Deletes a checklist by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after deletion.
 * @throws {ApiError} - Throws an error if the checklist is not found.
 */
const deleteCheckList = catchAsync(async (req, res) => {
    const checkList = await CheckList.getCheckList(req.params.id);
    if (!checkList) {
        throw new ApiError(httpStatus.NOT_FOUND, 'CheckList NOT FOUND');
    }
    await CheckList.deleteCheckList(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})
/**
 * Updates a checklist by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated checklist.
 * @throws {ApiError} - Throws an error if the checklist is not found.
 */
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
