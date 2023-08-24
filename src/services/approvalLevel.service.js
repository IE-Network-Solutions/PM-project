const httpStatus = require('http-status');
const { ApprovalLevel } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const approvalLevelRepository = dataSource.getRepository(ApprovalLevel).extend({
  findAll,
  sortBy,
});

/**
 * Create a approval level
 * @param {Object} approvalModuleBody
 * @returns {Promise<ApprovalLevel>}
 */
const createApprovalLevel = async () => {
  const approvalLevels = [
    { levelName: 'One Level', count: 1 },
    { levelName: 'Two Levels', count: 2 },
    { levelName: 'Three Levels', count: 3 },
    { levelName: 'Four Levels', count: 4 },
    { levelName: 'Five Levels', count: 5 },
    { levelName: 'Six Levels', count: 6 },
    { levelName: 'Seven Levels', count: 7 },
    { levelName: 'Eight Levels', count: 8 },
    { levelName: 'Nine Level', count: 9 },
  ];

  const levels = approvalLevels.map((approvalLevel) => {
    const moduleData = approvalLevelRepository.create(approvalLevel);
    return moduleData;
  });

  const moduleDatas = await approvalLevelRepository.save(levels);
  return moduleDatas;
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

const getApprovalLevels = async () => {
  return await approvalLevelRepository.find();
};

// /**
//  * Get budget by id
//  * @param {ObjectId} id
//  * @returns {Promise<Project>}
//  */
// const getApprovalModule = async (id) => {
//   return await approvalModuleRepository.findOneBy({ id: id });
// };

module.exports = {
  createApprovalLevel,
  getApprovalLevels,
};
