const httpStatus = require('http-status');
const { Evalution, CheckList, milestoneService, projectService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
/**
 * @module evalution
 */
/**
 * Creates a new evaluation.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created evaluation.
 * @throws {ApiError} - Throws an error if the evaluation cannot be created.
 */
const createEvalution = catchAsync(async (req, res, next) => {
    const todoEvalutionIds = req.body.todoEvalutionIds;
    const checkListId = req.body.checkListId;
    const result = await CheckList.getCheckList(checkListId);
    const evalution = await Evalution.createEvalution(checkListId);
    await milestoneService.updateIsEvaluted(result?.milestone?.id);
    const ids = await CheckList.createTodoEvalution(evalution.id, todoEvalutionIds);

    res.status(httpStatus.CREATED).send(evalution);
})

/**
 * Retrieves a specific evaluation by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested evaluation.
 * @throws {ApiError} - Throws an error if the evaluation is not found.
 */
const getEvalution = catchAsync(async (req, res) => {
    const evalution = await Evalution.getEvalution(req.params.id);
    if (!evalution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Evaluation not found');
    }

    res.status(httpStatus.OK).send(evalution);

});

/**
 * Retrieves all evaluations.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of evaluations.
 * @throws {ApiError} - Throws an error if no evaluations are found.
 */
const getEvalutions = catchAsync(async (req, res, next) => {
    const evalution = await Evalution.getEvalutions();
    if (!evalution) {
        return next(new ApiError(404, "Evalution NOT FOUND"))
    }
    res.status(httpStatus.OK).send(evalution)
})

/**
 * Retrieves the evaluation associated with a milestone ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the evaluation for the specified milestone.
 */
const getEvalutionByMilestoneId = catchAsync(async (req, res) => {
    const evalution = await Evalution.getEvalutionByMilestoneId(req.params.id);
    res.status(httpStatus.OK).send(evalution)
})

/**
 * Updates an evaluation by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated evaluation.
 */
const updateEvalution = catchAsync(async (req, res) => {

    const checkListId = req.body.checkListId;
    const todoEvalutionIds = req.body.todoEvalutionIds;

    const data = await Evalution.updateEvalution(checkListId, todoEvalutionIds);
    res.status(httpStatus.OK).send(data)

})


/**
 * Sends a milestone to DOO (Director of Operations).
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated milestone after sending to DOO.
 * @throws {ApiError} - Throws an error if the milestone cannot be sent to DOO.
 */
const sendToDOO = catchAsync(async (req, res) => {
    const sendToDoo = await milestoneService.updateIsSendToDOO(req.params.id);
    if (!sendToDoo) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send the Milestone to DOO')
    }
    res.status(httpStatus.OK).send(await milestoneService.getMilestone(req.params.id));
});

/**
 * Exports evaluation data to Excel for a specific milestone.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the project data including evaluation information.
 * @throws {ApiError} - Throws an error if the milestone is not evaluated.
 */
const exportEvaluationToExcelPerMilestone = catchAsync(async (req, res) => {
    const evaluation = await Evalution.getEvalutionByMilestoneId(req.params.id);
    const project = await projectService.getProject(evaluation?.evalution?.milestone?.projectId)
    if (!evaluation?.evalution?.milestone?.isEvaluted) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can\'t export')
    }
    project.evaluation = evaluation
    res.status(httpStatus.OK).send(project)
})

/**
 * Exports evaluation data to Excel for the entire project.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the project data including evaluation information.
 */
const exportEvaluationToExcelPerProject = catchAsync(async (req, res) => {
    const project = await projectService.getProjects();
    res.status(httpStatus.OK).send(project)
})

/**
 * Retrieves sent milestones by manager, associating evaluations with their respective projects.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a list of projects and their associated evaluations.
 */
const getSentMilestonesByManager = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['milestone']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const projects = await projectService.getProjects(filter, options);
    const milestones = await Evalution.getEvalutions();

    // Create a mapping of project IDs to their evaluations
    const evaluationsByProjectId = {};

    milestones?.evalution?.forEach((milestoneItem) => {
        const projectId = milestoneItem?.checkList?.milestone?.projectId;
        if (projectId) {
            if (!evaluationsByProjectId[projectId]) {
                evaluationsByProjectId[projectId] = [];
            }
            evaluationsByProjectId[projectId].push(milestoneItem);
        }
    });

    // Associate evaluations with their respective projects
    const projectsWithEvaluations = projects?.map((projectItem) => {
        const projectId = projectItem?.id;
        const projectEvaluations = evaluationsByProjectId[projectId] || [];
        return {
            ...projectItem,
            evaluations: projectEvaluations,
        };
    });

    res.status(httpStatus.OK).send({ projects: projectsWithEvaluations, todoEvalution : milestones.todoEvalution });
});


module.exports = {
    createEvalution,
    getEvalution,
    getEvalutions,
    getEvalutionByMilestoneId,
    updateEvalution,
    sendToDOO,
    exportEvaluationToExcelPerMilestone,
    exportEvaluationToExcelPerProject,
    getSentMilestonesByManager
}
