const httpStatus = require('http-status');
const {
  ApprovalLevel,
  ApprovalModule,
  ApprovalStage,
  BudgetGroup,
  ProjectMembers,
  User,
  BudgetComment,
  BudgetGroupComment,
} = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const approvalStageRepository = dataSource.getRepository(ApprovalStage).extend({
  findAll,
  sortBy,
});
const approvalModuleRepository = dataSource.getRepository(ApprovalModule).extend({
  findAll,
  sortBy,
});
const approvalGroupRepository = dataSource.getRepository(BudgetGroup).extend({
  findAll,
  sortBy,
});

const approvalBudgetCommentRepository = dataSource.getRepository(BudgetComment).extend({
  findAll,
  sortBy,
});
const approvalGroupCommentRepository = dataSource.getRepository(BudgetGroupComment).extend({
  findAll,
  sortBy,
});

const approvalProjectMemebrsRepository = dataSource.getRepository(ProjectMembers).extend({
  findAll,
  sortBy,
});
const userRepository = dataSource.getRepository(User).extend({
  findAll,
  sortBy,
});

/**
 * send for approval
 * @param {Object} approval
 * @returns {Promise<>}
 */
const sendForApproval = async (approvalModuleName, moduleId) => {
  let approvalModuleNamee = approvalModuleName;
  let moduleIdd = moduleId;

  // find the approval module which identifis for which module we are approving for which is seeded to the db(ProjectBudget,OfficeProjectBudget)
  const approvalModule = await approvalModuleRepository.findOne({ where: { moduleName: approvalModuleNamee } });
  let updatedModule = null;
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  // since it is about to sent for approval for the first time we will set the level to one(Approval Stage is the stage which holds the level with approving role)
  let level = 1;
  let moduleName = approvalModule.moduleName;
  const approvalStage = await approvalStageRepository
    .createQueryBuilder('approval_stage')
    .leftJoin('approval_stage.approvalModule', 'approvalModule')
    .leftJoin('approval_stage.role', 'role')
    .where('approvalModule.moduleName = :moduleName', { moduleName })
    .andWhere('approval_stage.level = :level', { level })
    .getOne();
  if (!approvalStage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval Stage does not exist');
  }
  // we will manage based on there module name
  if (approvalModule.moduleName == 'ProjectBudget') {
    const module = await approvalGroupRepository.findOne({ where: { id: moduleId } });
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    // assigne the approval stage to the budget group which is the group identifier of the monthly budget
    updatedModule = await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
  }
  let currentApprover = await getCurrentApprover(approvalModuleNamee, moduleIdd);
  return currentApprover;
};

/**
 * Query for approval level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getCurrentApprover = async (moduleName, moduleId) => {
  const approvalModule = await approvalModuleRepository.findOneBy({ moduleName: moduleName });
  let currentApprover = {};
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  if (approvalModule.moduleName == 'ProjectBudget') {
    const moduleData = await approvalGroupRepository
      .createQueryBuilder('budget_group')
      .leftJoin('budget_group.approvalStage', 'approvalStage')
      .leftJoin('approvalStage.role', 'role')
      .leftJoin('budget_group.project', 'project')
      .leftJoin('project.projectMembers', 'projectMembers')
      .select(['budget_group', 'approvalStage', 'project', 'projectMembers', 'role'])
      .where('budget_group.id = :moduleId', { moduleId })
      .getOne();
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval moduleData(group) does not exist');
    }
    console.log(moduleData);
    if (moduleData.approvalStage.role.isProjectRole) {
      let project = await moduleData.project;
      let projectId = project.id;
      let ProjectMemebrsRoleData = await approvalProjectMemebrsRepository
        .createQueryBuilder('project_member')
        .leftJoin('project_member.project', 'project')
        .leftJoin('project_member.user', 'user')
        .leftJoin('project_member.role', 'role')
        .select(['project_member', 'project', 'user', 'role'])
        .where('project.id = :projectId', { projectId })
        .getOne();
      currentApprover = ProjectMemebrsRoleData.filter((item) => item.roleId === moduleData.approvalStage.role.id);
      currentApprover = ProjectMemebrsRoleData;
    } else {
      currentApprover = userRepository.findOne({ where: { roleId: moduleData.approvalStage.role.id } });
    }
  }
  return currentApprover;
};

/**
 * Query for approval level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const approve = async (moduleName, moduleId) => {
  const approvalModule = await approvalModuleRepository.findOne({ where: { moduleName: moduleName } });
  let updatedModule;
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  if (approvalModule.moduleName == 'ProjectBudget') {
    const moduleData = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    if (approvalModule.max_level == moduleData.approvalStage.level) {
      // approve
      await approvalGroupRepository.update({ id: moduleId }, { approved: true });
      updatedModule = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
    } else {
      level = moduleData.approvalStage.level + 1;
      const approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule', 'approvalModule')
        .leftJoin('approval_stage.role', 'role')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();
      await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
      updatedModule = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });

      // ++approval
    }
  }
  return updatedModule;
};

/**
 * Query for approval level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const reject = async (moduleName, moduleId, comentData) => {
  const approvalModule = await approvalModuleRepository.findOne({ where: { moduleName: moduleName } });
  let updatedModule;
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  if (approvalModule.moduleName == 'ProjectBudget') {
    const moduleData = await approvalGroupRepository.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'comments'],
    });
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    console.log(comentData, 'llllllllllll');
    const comment = approvalBudgetCommentRepository.create({ budgetComment: comentData });
    console.log(comment);

    const budgetComment = await approvalBudgetCommentRepository.save(comment);
    console.log(moduleData, budgetComment, 'aaaaaaaaaaaaaaa');

    await moduleData.comments.push(budgetComment);

    await approvalGroupRepository.save(moduleData);

    // approve
    await approvalGroupRepository.update({ id: moduleId }, { rejected: true });
    updatedModule = await approvalGroupRepository.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'comments'],
    });
  }
  return updatedModule;
};

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getApprovalModule = async (id) => {
  return await approvalModuleRepository.findOneBy({ id: id });
};

module.exports = {
  sendForApproval,
  getCurrentApprover,
  approve,
  reject,
};
