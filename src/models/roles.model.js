const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Role extends Base {
  constructor() {
    super();
    this.roleName = { type: 'varchar' };
    this.isProjectRole = { type: 'boolean' };
  }
}

module.exports = new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: new Role(),
  relations: {
    user: {
      type: 'one-to-many',
      target: 'User',
      inverseSide: 'role',
    },
    projectMember: {
      type: 'one-to-many',
      target: 'ProjectMember',
      inverseSide: 'role',
    },
    rolePermission: {
      type: 'many-to-many',
      target: 'Permission',
      joinTable: {
        name: 'permission_role',
        joinColumn: { name: 'roleId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'permissionId',
          referencedColumnName: 'id',
        },
      },
    },
  },
});
