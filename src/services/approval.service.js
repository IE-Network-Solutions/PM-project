const httpStatus = require('http-status');
const { ApprovalLevel, ApprovalModule, ApprovalStage, BudgetGroup, ProjectMembers, User } = require('../models');
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
const approvalProjectMemebrsRepository = dataSource.getRepository(ProjectMembers).extend({
  findAll,
  sortBy,
});
const approvalUserRepository = dataSource.getRepository(User).extend({
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
  const approvalModule = await approvalModuleRepository.findOneBy({ moduleName: approvalModuleName });
  let updatedModule = null;
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  console.log(approvalModule.id, 'tersttttttttt');
  const approvalStage = await approvalStageRepository.findOne({ where: { level: 1 } });
  if (!approvalStage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval Stage does not exist');
  }
  // console.log(approvalModule.moduleName, 'cccccccccccccc');
  if (approvalModule.moduleName == 'ProjectBudget') {
    const module = await approvalGroupRepository.findOne({ where: { id: moduleId } });
    console.log(module, 'mmmmmmmmm');
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    updatedModule = await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
    console.log(updatedModule);
  }
  let currentApprover = await getCurrentApprover(approvalModuleNamee, moduleIdd);
  console.log(currentApprover);
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
  console.log('tttttttttt');
  const approvalModule = await approvalModuleRepository.findOneBy({ moduleName: moduleName });
  let currentApprover = {};
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  if (approvalModule.moduleName == 'ProjectBudget') {
    const module = await approvalGroupRepository
      .createQueryBuilder('budget_group')
      .leftJoin('budget_group.approvalStage', 'approvalStage')
      .leftJoin('approvalStage.role', 'role')
      .leftJoin('budget_group.project', 'project')
      .leftJoin('project.projectMembers', 'projectMembers')
      .select(['budget_group', 'approvalStage', 'project', 'projectMembers', 'role'])
      .where('budget_group.id = :moduleId', { moduleId })
      .getOne();

    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    console.log(module.approvalStage.role.isProjectRole, 'oooooooooooooooo');
    if (module.approvalStage.role.isProjectRole) {
      let project = await module.project;
      let projectId = project.id;
      let ProjectMemebrsRoleData = await approvalProjectMemebrsRepository
        .createQueryBuilder('project_member')
        .leftJoin('project_member.project', 'project')
        .leftJoin('project_member.user', 'user')
        .leftJoin('project_member.role', 'role')
        .select(['project_member', 'project', 'user', 'role'])
        .where('project.id = :projectId', { projectId })
        .getMany();
      currentApprover = ProjectMemebrsRoleData.filter((item) => item.roleId === module.approvalStage.role.id);
      console.log(module.approvalStage.role.id, 'roleeeeeeeee');
      currentApprover = ProjectMemebrsRoleData;
    } else {
      let project = await module.project;
      let projectId = project.id;
      let ProjectMemebrsRoleData = await approvalProjectMemebrsRepository
        .createQueryBuilder('project_member')
        .leftJoin('project_member.project', 'project')
        .leftJoin('project_member.user', 'user')
        .leftJoin('project_member.role', 'role')
        .select(['project_member', 'project', 'user', 'role'])
        .where('project.id = :projectId', { projectId })
        .getMany();
      currentApprover = ProjectMemebrsRoleData.filter((item) => item.roleId === module.approvalStage.role.id);
      // console.log(module.approvalStage.role.id, 'roleeeeeeeee');
      currentApprover = ProjectMemebrsRoleData;
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
  const approvalModule = await approvalModuleRepository.findOneBy({ moduleName: approvalModuleName });
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  if (moduleName == 'ProjectBudget') {
    const module = await approvalGroupRepository.findOneBy({ id: moduleId });
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    if (approvalModule.max_level == module.level) {
      // approve
    } else {
      level = module.level + 1;
      const approvalStage = await approvalStageRepository.findOneBy({ approvalModule: approvalModule, level: 1 });
      // ++approval
    }
  }
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
};
