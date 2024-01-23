const { EntitySchema } = require('typeorm');

const PermissionRole = new EntitySchema({
  name: 'PermissionRole',
  columns: {
    roleId: {
      type: 'uuid',
      primary: true,
    },
    permissionId: {
      type: 'uuid',
      primary: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'Role',
    },
    permission: {
      type: 'many-to-one',
      target: 'Permission',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  },
});

module.exports = PermissionRole;
