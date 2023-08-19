const httpStatus = require('http-status');
const { Project, ProjectMembers, ProjectContractValue } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const publishToRabbit = require('../utils/producer');

const projectRepository = dataSource.getRepository(Project).extend({
  findAll,
  sortBy,
});
const projectMemberRepository = dataSource.getRepository(ProjectMembers);
const projectContractValueRepository = dataSource.getRepository(ProjectContractValue);

/**
 * Create a user
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */

// const createProject = async (projectBody) => {
//   const project = projectRepository.create(projectBody);
//   return await projectRepository.save(project);
// };


   // project.service.js
const createProject = async (projectBody, projectMembers, projectContractValue) => {
  const project = projectRepository.create(projectBody);

  // Save the project instance
  await projectRepository.save(project);

  if (projectMembers) {
    const projectMemberInstances = projectMembers.map((member) => {
      return projectMemberRepository.create({
        projectId: project.id,
        memberId: member.memberId,
        memberName: member.memberName,
        roleId: member.roleId,
        roleName: member.roleName,
      });
    });

    // Save the project member instances
    await projectMemberRepository.save(projectMemberInstances);
  }

  if(projectContractValue){
    const projectContractValueInstance = projectContractValue.map((contract_value) => {
      return projectContractValueRepository.create({
        projectId: project.id,
        amount: contract_value.amount,
        currency: contract_value.currency
      });
    });
        // Save the project contract value instances
    await projectContractValueRepository.save(projectContractValueInstance);
  }

  project.projectMembers = projectMembers;
  project.projectContractValue = projectContractValue;
  publishToRabbit('project.create', project);

  return project;
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

const getProjects = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await projectRepository.find({
    tableName: 'projects',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
    relations: ['projectMembers', 'projectContractValues'],
  });
};


// project.service.js
// const getProjects = async () => {
//   return await projectRepository.findAll({
//     relations: ['projectMembers'], // Load the projectMembers association
//   });
// };


/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProject = async (id) => {
  return await projectRepository.findOneBy({ id: id });
};

/**
 * Update user by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateProject = async (projectId, updateBody) => {
  const project = await getProject(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await projectRepository.update({ id: projectId }, updateBody);
  const updatedProject= await getProject(projectId);
  publishToRabbit('project.update', updatedProject);
  return updatedProject;
};

/**
 * Delete user by id
 * @param {ObjectId} ProjectId
 * @returns {Promise<User>}
 */
const deleteProject = async (projectId) => {
  const project = await getProject(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  return await projectRepository.delete({ id: projectId });
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
