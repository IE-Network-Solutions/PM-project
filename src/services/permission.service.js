const httpStatus = require('http-status');
const { Permission, permissionUser, User, permissionRole, Role } = require('../models');
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
                    permissionId
            })
            return permissionUser;
        })
    
        const data = await permissionUserRepository.save(permissionUser);
        
        return data;
}

const assignPermissionToRole = async (permissionData) => {
        const role = await roleRepository.findOneBy({ id: permissionData.roleId });
        let permissionRoleData = permissionData.permissions.map((permissionId) => {
            const permission = permissionRepository.findOneBy({ id: permissionId });
            const permissionRole = permissionRoleRepository.create({
                    roleId: role.id,
                    permissionId
            })
            return permissionRole;
        })
    
        const data = await permissionRoleRepository.save(permissionRoleData);
        
        return data;
}

const seedPermission = async () => {
  const permissionData = [
    {
      'permissionName': 'View AAA',
      'slug': 'viewaaa'
    },
    {
      'permissionName': 'Create AAA',
      'slug': 'createaaa'
    },
    {
      'permissionName': 'Update AAA',
      'slug': 'updateaaa'
    },
    {
      'permissionName': 'Delete AAA',
      'slug': 'deleteaaa'
    },
    {
      'permissionName': 'View Baseline',
      'slug': 'viewbaseline'
    },
    {
      'permissionName': 'Create Baseline',
      'slug': 'createbaseline'
    },
    {
      'permissionName': 'Delete Baseline',
      'slug': 'deletebaseline'
    },
    {
      'permissionName': 'Update Baseline',
      'slug': 'updatebaseline'
    },
    {
      'permissionName': 'View Master Schedule',
      'slug': 'viewmasterschedule'
    },
    {
      'permissionName': 'View Filtered Master Schedule',
      'slug': 'viewfilteredmasterschedule'
    },
    {
      'permissionName': 'View Baseline By Milestone',
      'slug': 'viewbaselinebymilestone'
    },
    {
      'permissionName': 'View Project Scheule',
      'slug': 'viewprojectscheule'
    },
  ];
  const permissions = permissionData.map((permissionData) => {
    const permission = permissionRepository.create(permissionData);
    return permission;
  });
        
  const createdPermissions = await permissionRepository.save(permissions);
  return createdPermissions;
}

module.exports = {
    getPermissions,
    getPermission,
    assignPermissionToUser,
    seedPermission,
    assignPermissionToRole
};
