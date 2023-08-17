const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { LLCommentService, lessonLearnedService } = require('../services');

const createLLComment = catchAsync(async (req, res) => {
    const LLId = await lessonLearnedService.getLLById(req.body.lessonLearnedId)
    if (!LLId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL Id Contraint failed');
    }
    const result = await LLCommentService.createLLComment(req.body);
    res.status(httpStatus.CREATED).send(result);
});

const getLLComments = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await LLCommentService.queryLLComments(filter, options);
    res.send(result);
});

const getLLCommentById = catchAsync(async (req, res) => {
    const result = await LLCommentService.getLLCommentById(req.params.commentId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL Comment is not found');
    }
    res.send(result);
});

const updateLLCommentById = catchAsync(async (req, res) => {
    const result = await LLCommentService.updateLLCommentById(req.params.commentId, req.body);
    res.send(result);
});

const deleteLLCommentById = catchAsync(async (req, res) => {
    await LLCommentService.deleteLLCommentById(req.params.commentId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createLLComment,
    getLLComments,
    getLLCommentById,
    updateLLCommentById,
    deleteLLCommentById,
};
