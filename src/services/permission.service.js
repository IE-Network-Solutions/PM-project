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
      permissionName: 'Edit Schedule',
      slug: 'edit_schedule',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Payment Term',
      slug: 'add_payment_term',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Payment Term',
      slug: 'edit_payment_term',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Payment Term',
      slug: 'delete_payment_term',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Import Local Material',
      slug: 'import_local_material',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Create Project Budget',
      slug: 'create_project_budget',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Project Budget',
      slug: 'edit_project_budget',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Project Budget',
      slug: 'delete_project_budget',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Project Risk',
      slug: 'add_risk',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Project Risk',
      slug: 'edit_risk',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Project Risk',
      slug: 'delete_risk',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Transfer Project Risk',
      slug: 'transfer_risk',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Project Issue',
      slug: 'add_issue',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Project Issue',
      slug: 'edit_issue',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Project Issue',
      slug: 'delete_issue',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Project Resource',
      slug: 'add_project_resource',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Project Resource',
      slug: 'edit_project_resource',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Add Stakeholder',
      slug: 'add_stakeholder',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit Stakeholder',
      slug: 'edit_stakeholder',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete Stakeholder',
      slug: 'delete_stakeholder',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Send Weekly Report',
      slug: 'send_weekly_report',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Create LL Report',
      slug: 'create_ll_report',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete LL Report',
      slug: 'delete_ll_report',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Insert LL',
      slug: 'insert_ll',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Edit LL',
      slug: 'edit_ll',
      permissionResourceId: 1,
    },
    {
      permissionName: 'Delete LL',
      slug: 'delete_ll',
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
