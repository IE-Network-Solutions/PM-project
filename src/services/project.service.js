const httpStatus = require('http-status');
const { Project, ProjectMembers } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const projectRepository = dataSource.getRepository(Project).extend({
  findAll,
  sortBy,
});
const projectMemberRepository = dataSource.getRepository(ProjectMembers);

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
const createProject = async (projectBody, projectMembers) => {
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
    relations: ['projectMembers'],
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
  return await getProject(projectId);
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
