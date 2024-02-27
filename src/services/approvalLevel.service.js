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
 * @module approvalLevel
 */
/**
 * Creates and returns an array of approval level instances with predefined data
 * @function
 * @returns {Promise<Array<Object>>} - The array of approval level instances
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
 * Gets and returns an array of approval level instances from the repository
 * @function
 * @returns {Promise<Array<Object>>} - The array of approval level instances
 */
const getApprovalLevels = async () => {
  return await approvalLevelRepository.find();
};

module.exports = {
  createApprovalLevel,
  getApprovalLevels,
};
