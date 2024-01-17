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
 * Query for approval level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getPermissions = async () => {
  return await permissionRepository.find();
};

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getPermission = async (id) => {
  return await permissionRepository.findOneBy({ id: id });
};

const assignPermissionToUser = async (permissionData) => {
  const user = await userRepository.findOneBy({ id: permissionData.userId });
  let permissionUser = permissionData.permissions.map((permissionId) => {
    const permission = permissionRepository.findOneBy({ id: permissionId });
    const permissionUser = permissionUserRepository.create({
      user: user,
      permissionId,
    });
    return permissionUser;
  });

  const data = await permissionUserRepository.save(permissionUser);

  return data;
};

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

const seedPermission = async () => {
  const permissionData = [
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

const getResourcesWithPermission = async () => {
  const resources = await permissionResourceRepository.find();
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
