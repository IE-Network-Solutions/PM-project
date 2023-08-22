const httpStatus = require('http-status');
const { Mom, Task, Subtask } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const momRepository = dataSource.getRepository(Mom).extend({
  findAll,
  sortBy,
});
// const taskRepository = dataSource.getRepository(Task).extend({
//   findAll,
//   sortBy,
// });
// const subTaskRepository = dataSource.getRepository(Subtask).extend({
//   findAll,
//   sortBy,
// });

// .extend({ sortBy });
//

/**
 * Create a user
 * @param {Object} momBody
 * @returns {Promise<Mom>}
 */
const createMom = async (Attendees, Action, Agenda) => {

  console.log(req.body, Attendees, Action, Agenda)

  // const project = projectRepository.create(projectBody);

  // // Save the project instance
  // await projectRepository.save(project);

  // if (projectMembers) { 
  //   const projectMemberInstances = projectMembers.map((member) => {
  //     return projectMemberRepository.create({
  //       projectId: project.id,
  //       userId: member.memberId,
  //       roleId: member.roleId,
  //     });
  //   });

  //   // Save the project member instances
  //   await projectMemberRepository.save(projectMemberInstances);
  // }

  // if(projectContractValue){
  //   const projectContractValueInstance = projectContractValue.map((contract_value) => {
  //     return projectContractValueRepository.create({
  //       projectId: project.id,
  //       amount: contract_value.amount,
  //       currency: contract_value.currency
  //     });
  //   });
  //       // Save the project contract value instances
  //   await projectContractValueRepository.save(projectContractValueInstance);
  // }

  // project.projectMembers = projectMembers;
  // project.projectContractValue = projectContractValue;

  // return project;
};



/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getMoms = async (filter, options) => {
  const { limit, page, sortBy } = options;
  return await momRepository.findAll({
    tableName: 'moms',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Mom>}
 */
const getMom = async (milestoenId) => {
  return await momRepository.findOneBy({ id: milestoenId });
};


/**
 * Update user by id
 * @param {ObjectId} momId
 * @param {Object} updateBody
 * @returns {Promise<Mom>}
 */
const updateMom = async (momId, updateBody) => {
  const mom = await getMom(momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  await momRepository.update({ id: momId }, updateBody);
  return await getMom(momId);
};

/**
 * Delete user by id
 * @param {ObjectId} milestoenId
 * @returns {Promise<User>}
 */
const deleteMom = async (momId) => {
  const mom = await getMom(momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  return await momRepository.delete({ id: momId });
};

module.exports = {
  createMom,
  getMoms,
  getMom,
  updateMom,
  deleteMom,
};
