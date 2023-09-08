const httpStatus = require('http-status');
const { Project, ProjectMembers, ProjectContractValue, User } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const publishToRabbit = require('../utils/producer');
const { allActiveBaselineTasks } = require('./weeklyReport.service');


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
      return contract_value
    });
    // Save the project contract value instances
    await projectContractValueRepository.save(projectContractValueInstance);
  }

  let newProject = await getProject(project.id)
  newProject.projectMembers = projectMembers;
  // project.projectContractValue = projectContractValue;
  publishToRabbit('project.create', newProject);

  return newProject;
  // return await getProject(project.id)
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
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
    relations: ['projectMembers','projectContractValues.currency'],
  });
  // return await projectRepository.createQueryBuilder('project')
  //   .leftJoin('project.projectMembers', 'projectMember')
  //   .leftJoin('projectMember.role', 'role')
  //   .leftJoin('project.projectContractValues', 'projectContractValue')
  //   .addSelect(['projectMember', 'role', 'projectContractValue'])
  //   .getMany();
};




/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProject = async (id) => {
  return await projectRepository.findOne({
    where: { id: id },
    relations: ['projectMembers', 'projectContractValues.currency'],
  },
  );
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  await projectRepository.update({ id: projectId }, updateBody);
  const updatedProject = await getProject(projectId);
  updatedProject.members = await getMembers(updatedProject.id);
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
  // return await projectRepository.delete({ id: projectId });
  return await projectRepository.delete({ id: projectId }, updateBody);
};

/**
 * Delete user by id
 * @param {ObjectId} ProjectId
 * @returns {Promise<Project>}
 */

const getAllProjectTasksVarianceByProject = async () => {
  const projects = await projectRepository.find({
    tableName: 'projects'
  });
  const allProjectTasks = [];
  let project;
  for (project of projects) {
    const tasks = await allActiveBaselineTasks(project.id);
    project.tasks = tasks.tasksForVariance;
    allProjectTasks.push(project);
  }
  allProjectTasks.map((task) => {
    let startVariance = '';
    let finishVariance = '';

    let firstTask = task?.tasks[0];
    let lastTask = task?.tasks[task.tasks.length - 1];

    if (firstTask?.actualStart) {
      startVariance =
        new Date(firstTask.plannedStart).getTime() -
        new Date(firstTask.actualStart).getTime();
      startVariance = Math.ceil(startVariance / (1000 * 60 * 60 * 24));
    }

    if (lastTask?.actualFinish) {
      finishVariance =
        new Date(lastTask.plannedFinish).getTime() -
        new Date(lastTask.actualFinish).getTime();
      finishVariance = Math.ceil(finishVariance / (1000 * 60 * 60 * 24));
    }

    task.startVariance = startVariance;
    task.finishVariance = finishVariance;
    delete task.tasks;
  });

  return { Projects: allProjectTasks };
}

const getAllProjectsDetailOnMasterSchedule = async () => {
  const projects = await projectRepository.find({
    tableName: 'projects'
  });
  const allProjectTasks = [];
  let project;
  for (project of projects) {
    const tasks = await allActiveBaselineTasks(project.id);
    project.tasks = tasks.tasksForVariance;
    allProjectTasks.push(project);
  }
  return { Projects: allProjectTasks };
}


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

const getMembers = async (projectId) => {
  return await projectMemberRepository
    .createQueryBuilder('project_member')
    .where('project_member.projectId = :projectId', { projectId })
    .getMany();
}

const removeMember = async (projectId, memberToRemove) => {
  const projectMembersToRemove = await projectMemberRepository.find({
    where: {
      projectId: projectId,
      userId: memberToRemove.memberId,
      roleId: memberToRemove.roleId,
    }
  });



  return await projectMemberRepository.remove(projectMembersToRemove);


}

const getTotalActiveClosedProjects = async (filter, options) => {
  const projects = await getProjects(filter, options);
  const total = projects.length;
  const active = projects.filter(project => project.status === true).length;
  const closed = projects.filter(project => project.status === false).length;
  return { totalProjects: total, closedProjects: closed, activeProjcts: active };
}




module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getAllProjectTasksVarianceByProject,
  getAllProjectsDetailOnMasterSchedule,
  addMember,
  removeMember, getMembers,
  getTotalActiveClosedProjects
};
