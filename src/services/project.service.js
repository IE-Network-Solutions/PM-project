const httpStatus = require('http-status');
const { Project, ProjectMembers, ProjectContractValue, User } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const publishToRabbit = require('../utils/producer');
const { allActiveBaselineTasks } = require('./weeklyReport.service');
const { getClients } = require('./client.service');

const projectRepository = dataSource.getRepository(Project).extend({
  findAll,
  sortBy,
});
const projectMemberRepository = dataSource.getRepository(ProjectMembers);
const projectContractValueRepository = dataSource.getRepository(ProjectContractValue);

/**
 * @module project
 */
/**
 * Creates a new project with the specified details.
 * @async
 * @function
 * @param {Object} projectBody - The project details.
 * @param {string} projectBody.name - The name of the project.
 * @param {string} projectBody.description - The description of the project.
 * @param {number} projectBody.managerId - The unique identifier of the project manager.
 * @param {Array<Object>} projectMembers - An array of project member objects.
 * @param {Array<Object>} projectContractValue - An array of project contract value objects.
 * @throws {ApiError} Throws an error if creating the project fails.
 * @returns {Promise<Object>} The created project object.
 */
const createProject = async (projectBody, projectMembers, projectContractValue) => {
  const project = projectRepository.create(projectBody);

  // Save the project instance
  await projectRepository.save(project);

  if (projectMembers) {
    const projectMemberInstances = projectMembers.map((member) => {
      return projectMemberRepository.create({
        projectId: project.id,
        userId: member.memberId,
        roleId: member.roleId,
      });
    });

    // Save the project member instances
    await projectMemberRepository.save(projectMemberInstances);
  }

  if (projectContractValue) {
    const projectContractValueInstance = projectContractValue.map((contract_value) => {
      contract_value.project = project;
      return contract_value;
    });
    // Save the project contract value instances
    await projectContractValueRepository.save(projectContractValueInstance);
  }

  let newProject = await getProject(project.id);
  newProject.projectMembers = projectMembers;
  // project.projectContractValue = projectContractValue;
  publishToRabbit('project.create', newProject);

  return newProject;
  // return await getProject(project.id)
};
/**
 * Retrieves a list of projects based on specified filter and options.
 * @async
 * @function
 * @param {Object} filter - The filter criteria for projects (if any).
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of results to return.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @throws {ApiError} Throws an error if retrieving projects fails.
 * @returns {Promise<Array>} An array of project objects.
 */
const getProjects = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await projectRepository.find({
    tableName: 'projects',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
    relations: ['projectMembers', 'projectContractValues.currency'],
  });
  // return await projectRepository.createQueryBuilder('project')
  //   .leftJoin('project.projectMembers', 'projectMember')
  //   .leftJoin('projectMember.role', 'role')
  //   .leftJoin('project.projectContractValues', 'projectContractValue')
  //   .addSelect(['projectMember', 'role', 'projectContractValue'])
  //   .getMany();
};
/**
 * Retrieves project details by its unique identifier.
 * @async
 * @function
 * @param {number} id - The unique identifier of the project.
 * @throws {ApiError} Throws an error if retrieving the project fails.
 * @returns {Promise<Object>} The project object with associated members and contract values.
 */
const getProject = async (id) => {
  return await projectRepository.findOne({
    where: { id: id },
    relations: ['projectMembers', 'projectContractValues.currency'],
  });
};
/**
 * Updates an existing project with the specified details.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project to update.
 * @param {Object} updateBody - The updated project details.
 * @param {string} updateBody.name - The new name for the project.
 * @param {string} updateBody.description - The updated description of the project.
 * @param {number} updateBody.managerId - The updated unique identifier of the project manager.
 * @throws {ApiError} Throws an error if updating the project fails.
 * @returns {Promise<Object>} The updated project object with associated members.
 */
const updateProject = async (projectId, updateBody) => {
  const project = await getProject(projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  await projectRepository.update({ id: projectId }, updateBody);
  const updatedProject = await getProject(projectId);
  console.log(updatedProject, "ggmikkkg")
  updatedProject.members = await getMembers(updatedProject.id);

  publishToRabbit('project.update', updatedProject);

  console.log(updatedProject, 'sl up');
  return updatedProject;
};
/**
 * Deletes a project by marking it as deleted.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project to delete.
 * @throws {ApiError} Throws an error if the project does not exist.
 * @returns {Promise<string>} A success message indicating that the project has been deleted.
 */
const deleteProject = async (projectId) => {
  const project = await getProject(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  // return await projectRepository.delete({ id: projectId });
  await projectRepository.delete({ id: projectId });
  return 'Project Deleted';
};
/**
 * Retrieves variance information for all projects.
 * @async
 * @function
 * @throws {ApiError} Throws an error if retrieving variance data fails.
 * @returns {Promise<Object>} An object containing variance details for each project.
 */
const getAllProjectTasksVarianceByProject = async () => {
  const projects = await projectRepository.find({
    tableName: 'projects',
  });
  const allProjectTasks = [];
  let project;
  // for (project of projects) {
  //   const tasks = await allActiveBaselineTasks(project.id);
  //   project.tasks = tasks.tasksForVariance;
  //   allProjectTasks.push(project);
  // }
  // allProjectTasks.map((task) => {
  //   let startVariance = '';
  //   let finishVariance = '';

  //   let firstTask = task?.tasks[0];
  //   let lastTask = task?.tasks[task.tasks.length - 1];

  //   if (firstTask?.actualStart) {
  //     startVariance = new Date(firstTask.plannedStart).getTime() - new Date(firstTask.actualStart).getTime();
  //     startVariance = Math.ceil(startVariance / (1000 * 60 * 60 * 24));
  //   }

  //   if (lastTask?.actualFinish) {
  //     finishVariance = new Date(lastTask.plannedFinish).getTime() - new Date(lastTask.actualFinish).getTime();
  //     finishVariance = Math.ceil(finishVariance / (1000 * 60 * 60 * 24));
  //   }

  //   task.startVariance = startVariance;
  //   task.finishVariance = finishVariance;
  //   delete task.tasks;
  // });

  return { Projects: allProjectTasks };
};
/**
 * Retrieves variance information for all projects.
 * @async
 * @function
 * @throws {ApiError} Throws an error if retrieving variance data fails.
 * @returns {Promise<Object>} An object containing variance details for each project.
 */
const getAllProjectsDetailOnMasterSchedule = async () => {
  const projects = await projectRepository.find({
    tableName: 'projects',
  });
  const allProjectTasks = [];
  let project;
  for (project of projects) {
    const tasks = await allActiveBaselineTasks(project.id);
    project.tasks = tasks.tasksForVariance;
    allProjectTasks.push(project);
  }
  return { Projects: allProjectTasks };
};
/**
 * Adds project members to a specified project.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project.
 * @param {Array<Object>} projectMembers - An array of project member objects.
 * @param {number} projectMembers.memberId - The unique identifier of the user.
 * @param {number} projectMembers.roleId - The unique identifier of the role.
 * @throws {ApiError} Throws an error if adding project members fails.
 * @returns {Promise<Object>} The updated project object with associated members.
 */
const addMember = async (projectId, projectMembers) => {
  const project = await projectRepository.findOneBy({ id: projectId });

  if (projectMembers) {
    const projectMemberInstances = projectMembers.map((member) => {
      return projectMemberRepository.create({
        projectId: projectId,
        userId: member.memberId,
        roleId: member.roleId,
      });
    });

    await projectMemberRepository.save(projectMemberInstances);
    project.projectMembers = projectMembers;
  }
  return project;
};
/**
 * Retrieves project members associated with a specific project.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project.
 * @throws {ApiError} Throws an error if retrieving project members fails.
 * @returns {Promise<Array>} An array of user objects representing project members.
 */
const getMembers = async (projectId) => {
  const projectMemebrs = await projectMemberRepository
    .createQueryBuilder('project_member')
    .leftJoinAndSelect('project_member.user', 'user')
    .where('project_member.projectId = :projectId', { projectId })
    .getMany();
  const users = [];

  projectMemebrs.map((user) => {
    users.push(user.user);
  });
  return users;
};
/**
 * Removes a project member from a specified project.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project.
 * @param {Object} memberToRemove - The project member to remove.
 * @param {number} memberToRemove.memberId - The unique identifier of the user to remove.
 * @param {number} memberToRemove.roleId - The unique identifier of the role associated with the user.
 * @throws {ApiError} Throws an error if removing the project member fails.
 * @returns {Promise<void>} A success message indicating that the project member has been removed.
 */
const removeMember = async (projectId, memberToRemove) => {
  const projectMembersToRemove = await projectMemberRepository.find({
    where: {
      projectId: projectId,
      userId: memberToRemove.memberId,
      roleId: memberToRemove.roleId,
    },
  });

  return await projectMemberRepository.remove(projectMembersToRemove);
};
/**
 * Closes a project by updating its status.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project to close.
 * @param {string} status - The updated status for the project (e.g., 'Closed').
 * @throws {ApiError} Throws an error if closing the project fails.
 * @returns {Promise<Object>} The updated project object.
 */
const closeProject = async (projectId, status) => {
  const project = await getProject(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  project.status = status;
  await projectRepository.update({ id: projectId }, status);

  return await getProject(projectId);
};
/**
 * Retrieves the total number of projects, as well as the count of active and closed projects.
 *
 * @function
 * @param {Object} filter - An object containing filter criteria for project retrieval.
 * @param {Object} options - Additional options for querying projects.
 * @returns {Promise<Object>} - An object with the following properties:
 *   - {number} totalProjects - Total number of projects.
 *   - {number} closedProjects - Number of closed projects.
 *   - {number} activeProjects - Number of active projects.
 */
const getTotalActiveClosedProjects = async (filter, options) => {
  const projects = await getProjects(filter, options);
  const total = projects.length;
  const active = projects.filter((project) => project.status === true).length;
  const closed = projects.filter((project) => project.status === false).length;
  return { totalProjects: total, closedProjects: closed, activeProjcts: active };
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getAllProjectTasksVarianceByProject,
  getAllProjectsDetailOnMasterSchedule,
  addMember,
  removeMember,
  getMembers,
  getTotalActiveClosedProjects,
  removeMember,
  closeProject,
};
