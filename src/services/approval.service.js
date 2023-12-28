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
  Baseline,
  baselineComment,
  monthlyBudget,
  monthlyBudgetComment,
  OfficeMonthlyBudget,
  OfficeMonthlyBudgetComment,
} = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');
const publishToRabbit = require('../utils/producer');
const OfficeMonthlyBudgetCommentModel = require('../models/OfficeMonthlyBudgetComment.model');

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
const baselineRepository = dataSource.getRepository(Baseline).extend({
  findAll,
  sortBy,
});

const approvalBudgetCommentRepository = dataSource.getRepository(BudgetComment).extend({
  findAll,
  sortBy,
});
const approvalBaselineCommentRepository = dataSource.getRepository(baselineComment).extend({
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
const baselineCommentRepository = dataSource.getRepository(baselineComment).extend({
  findAll,
  sortBy,
});

const monthlyBudgetRepostory = dataSource.getRepository(monthlyBudget).extend({
  findAll,
  sortBy,
});
const monthlyBudgetCommentRepository = dataSource.getRepository(monthlyBudgetComment).extend({
  findAll,
  sortBy,
});
const officeMonthlyBudgetRepostory = dataSource.getRepository(OfficeMonthlyBudget).extend({
  findAll,
  sortBy,
});
const officeMonthlyBudgetCommentRepository = dataSource.getRepository(OfficeMonthlyBudgetComment).extend({
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
  } else if (approvalModule.moduleName == 'ProjectSchedule') {
    const module = await baselineRepository.findOne({ where: { id: moduleId } });
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(baseline) does not exist');
    }
    //assigne the approval stage to the budget group which is the group identifier of the monthly budget

    updatedModule = await baselineRepository.update({ id: moduleId }, { approvalStage: approvalStage });
  } else if (approvalModule.moduleName == 'OfficeProjectBudget') {
    const module = await approvalGroupRepository.findOne({ where: { id: moduleId } });
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(baseline) does not exist');
    }
    //assigne the approval stage to the budget group which is the group identifier of the monthly budget

    updatedModule = await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
  }
  let currentApprover = await getCurrentApprover(approvalModule.moduleName, moduleIdd);
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
    if (moduleData.approvalStage.project_role) {
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
  } else if (approvalModule.moduleName == 'ProjectSchedule') {
    const moduleData = await baselineRepository
      .createQueryBuilder('baseline')
      .leftJoin('baseline.approvalStage', 'approvalStage')
      .leftJoin('approvalStage.role', 'role')
      .leftJoin('baseline.project', 'project')
      .leftJoin('project.projectMembers', 'projectMembers')
      .select(['baseline', 'approvalStage', 'project', 'projectMembers', 'role'])
      .where('baseline.id = :moduleId', { moduleId })
      .getOne();
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval moduleData(baseline) does not exist');
    }

    if (moduleData.approvalStage.project_role) {
      let project = await moduleData.project;

      let projectId = project.id;
      let roleId = moduleData.approvalStage.role.id;
      let ProjectMemebrsRoleData = await approvalProjectMemebrsRepository
        .createQueryBuilder('project_member')
        .leftJoin('project_member.project', 'project')
        .leftJoin('project_member.user', 'user')
        .leftJoin('project_member.role', 'role')
        .select(['project_member', 'project', 'user', 'role'])
        .where('project.id = :projectId', { projectId })
        .andWhere('project_member.roleId = :roleId', { roleId })
        .getOne();
      // currentApprover = ProjectMemebrsRoleData.filter((item) => item.roleId === moduleData.approvalStage.role.id);
      console.log(ProjectMemebrsRoleData, 'abr');
      currentApprover = ProjectMemebrsRoleData;
    } else {
      currentApprover = userRepository.findOne({ where: { roleId: moduleData.approvalStage.role.id }, relations: ['role'] });
    }
  } else if (approvalModule.moduleName == 'MonthlyBudget') {
    const moduleData = await monthlyBudgetRepostory
      .createQueryBuilder('monthly_budgets')
      .leftJoin('monthly_budgets.approvalStage', 'approvalStage')
      .leftJoin('approvalStage.role', 'role')
      .select(['monthly_budgets', 'approvalStage', 'role'])
      .where('monthly_budgets.id = :moduleId', { moduleId })
      .getOne();
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval moduleData(MonthlyBudget) does not exist');
    }

    if (moduleData.approvalStage.project_role) {
      let project = await moduleData.project;

      let projectId = project.id;
      let roleId = moduleData.approvalStage.role.id;
      let ProjectMemebrsRoleData = await approvalProjectMemebrsRepository
        .createQueryBuilder('project_member')
        .leftJoin('project_member.project', 'project')
        .leftJoin('project_member.user', 'user')
        .leftJoin('project_member.role', 'role')
        .select(['project_member', 'project', 'user', 'role'])
        .where('project.id = :projectId', { projectId })
        .andWhere('project_member.roleId = :roleId', { roleId })
        .getOne();
      currentApprover = ProjectMemebrsRoleData;
    } else {
      currentApprover = userRepository.findOne({ where: { roleId: moduleData.approvalStage.role.id }, relations: ['role'] });
    }
  } else if (approvalModule.moduleName == 'OfficeProjectBudget') {
    const moduleData = await approvalGroupRepository.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'approvalStage.role'],
    });
    console.log(moduleData, 'khaduirqeyuirqyppweincncnc');
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval moduleData(MonthlyBudget) does not exist');
    }

    if (moduleData.approvalStage.project_role) {
      let projectId = await moduleData.budgetsData.project_id;

      // let projectId = project.id;
      let roleId = moduleData.approvalStage.role.id;
      let ProjectMemebrsRoleData = await approvalProjectMemebrsRepository
        .createQueryBuilder('project_member')
        .leftJoin('project_member.project', 'project')
        .leftJoin('project_member.user', 'user')
        .leftJoin('project_member.role', 'role')
        .select(['project_member', 'project', 'user', 'role'])
        .where('project.id = :projectId', { projectId })
        .andWhere('project_member.roleId = :roleId', { roleId })
        .getOne();
      currentApprover = ProjectMemebrsRoleData;
    } else {
      currentApprover = userRepository.findOne({ where: { roleId: moduleData.approvalStage.role.id }, relations: ['role'] });
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
    console.log(approvalModule.max_level, moduleData.approvalStage.level, 'hhhhhhhhhhhhh');
    if (approvalModule.max_level == moduleData.approvalStage.level) {
      // approve
      await approvalGroupRepository.update({ id: moduleId }, { approved: true });
      updatedModule = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
      console.log('selammmmm', updatedModule);
      // Rabit Mq Producer
      let approvedByGroup = await services.budgetService.getBudgetGroupByCategory(
        approvalGroupRepository.from,
        approvalGroupRepository.to
      );
      publishToRabbit('project.budget', approvedByGroup);
      console.log(approvedByGroup);
    } else {
      level = moduleData.approvalStage.level + 1;
      const approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule', 'approvalModule')
        .leftJoin('approval_stage.role', 'role')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();
      console.log(approvalStage, 'ooooooooooo');
      await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
      updatedModule = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
      // ++approval
    }
  } else if (approvalModule.moduleName == 'ProjectSchedule') {
    const moduleData = await baselineRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(baseline) does not exist');
    }
    if (approvalModule.max_level == moduleData.approvalStage.level) {
      // approve
      await baselineRepository.update({ id: moduleId }, { approved: true });
      updatedModule = await baselineRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
      // Rabit Mq Producer
      // let approvedByGroup=await services.budgetService.getBudgetGroupByCategory(moduleId)
      // publishToRabbit('project.budget',approvedByGroup)
      // console.log(approvedByGroup)
    } else {
      level = moduleData.approvalStage.level + 1;
      const approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule', 'approvalModule')
        .leftJoin('approval_stage.role', 'role')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();
      console.log(approvalStage, 'ooooooooooo');
      await baselineRepository.update({ id: moduleId }, { approvalStage: approvalStage });
      updatedModule = await baselineRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
      // console.log(updatedModule,"tttttttttt")
      // ++approval
    }
  } else if (approvalModule.moduleName == 'MonthlyBudget') {
    const moduleData = await monthlyBudgetRepostory.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(monthly budget) does not exist');
    }
    if (approvalModule.max_level == moduleData.approvalStage.level) {
      // approve
      await monthlyBudgetRepostory.update({ id: moduleId }, { approved: true });
      updatedModule = await monthlyBudgetRepostory.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
      // Rabit Mq Producer
      // let approvedByGroup=await services.budgetService.getBudgetGroupByCategory(moduleId)
      // publishToRabbit('project.budget',approvedByGroup)
      // console.log(approvedByGroup)
    } else {
      level = moduleData.approvalStage.level + 1;
      const approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule', 'approvalModule')
        .leftJoin('approval_stage.role', 'role')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();

      await monthlyBudgetRepostory.update({ id: moduleId }, { approvalStage: approvalStage });
      updatedModule = await monthlyBudgetRepostory.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
    }
  } else if (approvalModule.moduleName == 'OfficeProjectBudget') {
    const moduleData = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
    console.log(moduleData, 'imoduname');
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(monthly budget) does not exist');
    }
    if (approvalModule.max_level == moduleData.approvalStage.level) {
      // approve
      await approvalGroupRepository.update({ id: moduleId }, { approved: true });
      updatedModule = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
      // Rabit Mq Producer
      // let approvedByGroup=await services.budgetService.getBudgetGroupByCategory(moduleId)
      // publishToRabbit('project.budget',approvedByGroup)
      // console.log(approvedByGroup)
    } else {
      level = moduleData.approvalStage.level + 1;
      const approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule', 'approvalModule')
        .leftJoin('approval_stage.role', 'role')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();
      console.log(approvalStage, 'approvalStagekkk');

      await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
      updatedModule = await approvalGroupRepository.findOne({ where: { id: moduleId }, relations: ['approvalStage'] });
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

const reject = async (moduleName, moduleId, comentData, userId = null) => {
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
  } else if (approvalModule.moduleName == 'ProjectSchedule') {
    const moduleData = await baselineRepository.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'baselineComment'],
    });
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(baseline) does not exist');
    }
    const comment = approvalBaselineCommentRepository.create({ comment: comentData, baseline: moduleData, userId });
    console.log(comment);

    const budgetComment = await approvalBaselineCommentRepository.save(comment);
    console.log(moduleData, budgetComment, 'aaaaaaaaaaaaaaa');

    await moduleData.baselineComment.push(budgetComment);

    // approve
    await baselineRepository.update({ id: moduleId }, { rejected: true });
    updatedModule = await baselineRepository.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'baselineComment'],
    });
  } else if (approvalModule.moduleName == 'MonthlyBudget') {
    const moduleData = await monthlyBudgetRepostory.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'monthlyBudgetcomments'],
    });
    if (!moduleData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(monthly budget) does not exist');
    }
    const comment = await monthlyBudgetCommentRepository.create({ budgetComment: comentData, monthlyBudget: moduleData });

    const monthlBbudgetComment = await monthlyBudgetCommentRepository.save(comment);

    await moduleData.monthlyBudgetcomments.push(monthlBbudgetComment);

    // approve
    await monthlyBudgetRepostory.update({ id: moduleId }, { rejected: true });
    updatedModule = await monthlyBudgetRepostory.findOne({
      where: { id: moduleId },
      relations: ['approvalStage', 'monthlyBudgetcomments'],
    });
  } else if (approvalModule.moduleName == 'OfficeProjectBudget') {
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
