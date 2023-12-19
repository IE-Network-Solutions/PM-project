const { EntitySchema } = require('typeorm');

const PermissionUser = new EntitySchema({
  name: 'PermissionUser',
  columns: {
    userId: {
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
      target: 'User',
    },
    permission: {
      type: 'many-to-one',
      target: 'Permission',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  },
});

module.exports = PermissionUser;
