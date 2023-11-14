const httpStatus = require('http-status');
const { ApprovalModule } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const approvalModuleRepository = dataSource.getRepository(ApprovalModule).extend({
  findAll,
  sortBy,
});

/**
 * Create a approval module
 * @param {Object} approvalModuleBody
 * @returns {Promise<ApprovalModule>}
 */
const createApprovalModule = async () => {
  const approvalModules = [{ moduleName: 'ProjectBudget' }, { moduleName: 'OfficeProjectBudget' }, { moduleName: 'ProjectSchedule' }];

  const modules = approvalModules.map((approvalModule) => {
    // console.log(approvalModule);
    // const module = await getApprovalModuleByModuleName(approvalModule.moduleName);
    // console.log('return dataaa', module);
    // if (!module) {
    const moduleData = approvalModuleRepository.create(approvalModule);
    console.log('created data', moduleData);

    return moduleData;
    // }
  });
  console.log(modules);

  const moduleDatas = await approvalModuleRepository.save(modules);
  return moduleDatas;
};

/**
 * get a approval module by module name
 * @param {Object} approvalModuleBody
 * @returns {Promise<ApprovalModule>}
 */
const getApprovalModuleByModuleName = async (moduleName) => {
  const module = approvalModuleRepository.findOne({ where: { moduleName: moduleName } });
  return module;
};

/**
 * Query for budget
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getApprovalModules = async () => {
  return await approvalModuleRepository.find();
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
  createApprovalModule,
  getApprovalModuleByModuleName,
  getApprovalModules,
  getApprovalModule,
};
