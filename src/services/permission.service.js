const httpStatus = require('http-status');
const { Permission, permissionUser, User, permissionRole, Role, permissionResource } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const permissionRepository = dataSource.getRepository(Permission).extend({
  findAll,
  sortBy,
});
const permissionUserRepository = dataSource.getRepository(permissionUser).extend({
  findAll,
  sortBy,
});
const permissionRoleRepository = dataSource.getRepository(permissionRole).extend({
  findAll,
  sortBy,
});
const userRepository = dataSource.getRepository(User).extend({
  findAll,
  sortBy,
});
const roleRepository = dataSource.getRepository(Role).extend({
  findAll,
  sortBy,
});
const permissionResourceRepository = dataSource.getRepository(permissionResource).extend({
  findAll,
  sortBy,
});
/**
 * @module permission
 */
/**
 * Retrieves permissions from the repository.
 * @async
 * @function
 * @throws {ApiError} Throws an error if retrieving permissions fails.
 * @returns {Promise<Array>} An array of permission objects.
 */
const getPermissions = async () => {
  return await permissionRepository.find();
};
/**
 * Retrieves a permission by its unique identifier.
 * @async
 * @function
 * @param {number} id - The unique identifier of the permission.
 * @throws {ApiError} Throws an error if retrieving the permission fails.
 * @returns {Promise<Object>} The permission object.
 */
const getPermission = async (id) => {
  return await permissionRepository.findOneBy({ id: id });
};
/**
 * Assigns permissions to a user.
 * @async
 * @function
 * @param {Object} permissionData - The permission assignment details.
 * @param {number} permissionData.userId - The unique identifier of the user.
 * @param {Array<number>} permissionData.permissions - An array of permission identifiers to assign.
 * @throws {ApiError} Throws an error if assigning permissions fails.
 * @returns {Promise<Array>} An array of user objects with updated permissions.
 */
const assignPermissionToUser = async (permissionData) => {
  const user = await userRepository.findOneBy({ id: permissionData.userId });
  user.permissions = [];
  await userRepository.save(user);
  let permissionUser = permissionData.permissions.map((permissionId) => {
    const permission = permissionRepository.findOneBy({ id: permissionId });
    const permissionUser = permissionUserRepository.create({
      user: user,
      permissionId,
    });
    return permissionUser;
  });

  const data = await permissionUserRepository.save(permissionUser);

  return await userRepository.find({ relations: ['permissions', 'role'] });
};
/**
 * Assigns permissions to a role.
 * @async
 * @function
 * @param {Object} permissionData - The permission assignment details.
 * @param {number} permissionData.roleId - The unique identifier of the role.
 * @param {Array<number>} permissionData.permissions - An array of permission identifiers to assign.
 * @throws {ApiError} Throws an error if assigning permissions fails.
 * @returns {Promise<Array>} An array of permission role objects.
 */
const assignPermissionToRole = async (permissionData) => {
  const role = await roleRepository.findOneBy({ id: permissionData.roleId });
  let permissionRoleData = permissionData.permissions.map((permissionId) => {
    const permission = permissionRepository.findOneBy({ id: permissionId });
    const permissionRole = permissionRoleRepository.create({
      roleId: role.id,
      permissionId,
    });
    return permissionRole;
  });

  const data = await permissionRoleRepository.save(permissionRoleData);

  return data;
};
/**
 * Seeds permissions in the repository.
 * @async
 * @function
 * @throws {ApiError} Throws an error if seeding permissions fails.
 * @returns {Promise<Array>} An array of created permission objects.
 */
const seedPermission = async () => {
  const permissionData = [
    {
      permissionName: 'View Manager Dashboard',
      slug: 'view_manager_dashboard',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Create Project',
      slug: 'create_project',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View Project Option',
      slug: 'view_project_option',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View Project Option',
      slug: 'view_project_option',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Project',
      slug: 'edit_project',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Project',
      slug: 'delete_project',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Close Project',
      slug: 'close_project',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View Project Detail',
      slug: 'view_project_detail',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Project Boq',
      slug: 'add_project_boq',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Download Project Boq',
      slug: 'download_project_boq',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Project Memeber',
      slug: 'add_project_memeber',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Remove Project Memeber',
      slug: 'remove_project_memeber',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Manage Project',
      slug: 'manage_project',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Manage Project',
      slug: 'manage_project',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Milestone',
      slug: 'add_milestone',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Milestone',
      slug: 'edit_milestone',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Milestone',
      slug: 'delete_milestone',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Schedule',
      slug: 'add_schedule',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Milestone',
      slug: 'delete_milestone',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View AAA',
      slug: 'view_aaa',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Create AAA',
      slug: 'create_aaa',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Update AAA',
      slug: 'update_aaa',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete AAA',
      slug: 'deleteaaa',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View Baseline',
      slug: 'viewbaseline',
      permissionResourceId: 2,
    },
    {
      permissionName: 'Create Baseline',
      slug: 'createbaseline',
      permissionResourceId: 2,
    },
    {
      permissionName: 'Delete Baseline',
      slug: 'deletebaseline',
      permissionResourceId: 2,
    },
    {
      permissionName: 'Update Baseline',
      slug: 'updatebaseline',
      permissionResourceId: 2,
    },
    {
      permissionName: 'View Master Schedule',
      slug: 'viewmasterschedule',
      permissionResourceId: 2,
    },
    {
      permissionName: 'View Filtered Master Schedule',
      slug: 'viewfilteredmasterschedule',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View Baseline By Milestone',
      slug: 'viewbaselinebymilestone',
      permissionResourceId: 1,
    },
    {
      permissionName: 'View Project Scheule',
      slug: 'viewprojectscheule',
      permissionResourceId: 2,
    },
  ];
  const permissions = permissionData.map((permissionData) => {
    const permission = permissionRepository.create(permissionData);
    return permission;
  });

  const createdPermissions = await permissionRepository.save(permissions);
  return createdPermissions;
};
/**
 * Seeds permission resources in the repository.
 * @async
 * @function
 * @throws {ApiError} Throws an error if seeding permission resources fails.
 * @returns {Promise<Array>} An array of created permission resource objects.
 */
const seedPermissionResource = async () => {
  const resourceData = [
    {
      id: 1,
      permissionResourceName: 'Project',
    },
    {
      id: 2,
      permissionResourceName: 'Schedule',
    },
    {
      id: 3,
      permissionResourceName: 'Budget',
    },
  ];

  const permissionResources = resourceData.map((permissionData) => {
    const permission = permissionResourceRepository.create(permissionData);
    return permission;
  });

  const createdResourcePermissions = await permissionResourceRepository.save(permissionResources);
  return createdResourcePermissions;
};
/**
 * Retrieves permissions resources along with associated permissions.
 * @async
 * @function
 * @throws {ApiError} Throws an error if retrieving permission resources fails.
 * @returns {Promise<Array>} An array of permission resource objects.
 */
const getResourcesWithPermission = async () => {
  const resources = await permissionResourceRepository.find({ relations: ['permissions'] });
  return resources;
};

module.exports = {
  getPermissions,
  getPermission,
  assignPermissionToUser,
  seedPermission,
  assignPermissionToRole,
  seedPermissionResource,
  getResourcesWithPermission,
};
