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
 * @module approvalModule
 */
/**
 * Creates and returns an array of approval module instances with predefined data
 * @function
 * @returns {Promise<Array<Object>>} - The array of approval module instances
 */
const createApprovalModule = async () => {
  const approvalModules = [
    { moduleName: 'ProjectBudget', max_level: 1 },
    { moduleName: 'OfficeProjectBudget', max_level: 3 },
    { moduleName: 'ProjectSchedule', max_level: 2 },
    { moduleName: 'MonthlyBudget', max_level: 2 },
    { moduleName: 'OfficeProjectQuarterlyBudget', max_level: 2 },
  ];

  const modules = approvalModules.map((approvalModule) => {
    // const module = await getApprovalModuleByModuleName(approvalModule.moduleName);
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
 * Retrieves an approval module by its module name.
 * @function
 * @async
 * @param {string} moduleName - The name of the approval module.
 * @returns {Promise<ApprovalModule | null>} - The approval module object, or null if not found.
 */
const getApprovalModuleByModuleName = async (moduleName) => {
  const module = approvalModuleRepository.findOne({ where: { moduleName: moduleName } });
  return module;
};
/**
 * Retrieves all approval modules.
 * @function
 * @async
 * @returns {Promise<ApprovalModule[]>} - An array of approval module objects.
 */
const getApprovalModules = async () => {
  return await approvalModuleRepository.find();
};
/**
 * Retrieves an approval module by its ID.
 * @function
 * @async
 * @param {number} id - The unique identifier of the approval module.
 * @returns {Promise<ApprovalModule | null>} - The approval module object, or null if not found.
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
