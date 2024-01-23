const httpStatus = require('http-status');
const { Evalution, CheckList, milestoneService, projectService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

const createEvalution = catchAsync(async (req, res, next) => {
    const todoEvalutionIds = req.body.todoEvalutionIds;
    const checkListId = req.body.checkListId;
    const result = await CheckList.getCheckList(checkListId);
    const evalution = await Evalution.createEvalution(checkListId);
    await milestoneService.updateIsEvaluted(result?.milestone?.id);
    const ids = await CheckList.createTodoEvalution(evalution.id, todoEvalutionIds);
   
    res.status(httpStatus.CREATED).send(evalution);
})

const getEvalution = catchAsync(async (req, res) => {
    const evalution = await Evalution.getEvalution(req.params.id);
    if (!evalution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Evaluation not found');
    }

    res.status(httpStatus.OK).send(evalution);

});

const getEvalutions = catchAsync(async (req, res, next) => {
    const evalution = await Evalution.getEvalutions();
    if (!evalution) {
        return next(new ApiError(404, "Evalution NOT FOUND"))
    }
    res.status(httpStatus.OK).send(evalution)
})

const getEvalutionByMilestoneId = catchAsync(async (req, res) => {
    const evalution = await Evalution.getEvalutionByMilestoneId(req.params.id);
    res.status(httpStatus.OK).send(evalution)
})

const updateEvalution = catchAsync(async (req, res) => {
    
    const checkListId = req.body.checkListId;
    const todoEvalutionIds = req.body.todoEvalutionIds;

    const data = await Evalution.updateEvalution(checkListId, todoEvalutionIds);
    res.status(httpStatus.OK).send(data)

})

const sendToDOO = catchAsync(async (req, res) => {
    const sendToDoo = await milestoneService.updateIsSendToDOO(req.params.id);
    if (!sendToDoo) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send the Milestone to DOO')
    }
    res.status(httpStatus.OK).send(await milestoneService.getMilestone(req.params.id));
});
const exportEvaluationToExcelPerMilestone = catchAsync(async (req, res) => {
    const evaluation = await Evalution.getEvalutionByMilestoneId(req.params.id);
    const project = await projectService.getProject(evaluation?.evalution?.milestone?.projectId)
    if (!evaluation?.evalution?.milestone?.isEvaluted) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can\'t export')
    }
    project.evaluation = evaluation
    res.status(httpStatus.OK).send(project)
})

const exportEvaluationToExcelPerProject = catchAsync(async (req, res) => {
    const project = await projectService.getProjects();
    res.status(httpStatus.OK).send(project)
})

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