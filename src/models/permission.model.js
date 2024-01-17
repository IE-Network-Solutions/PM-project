const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Permission extends Base {
  constructor() {
    super();
    this.permissionName = { type: 'varchar' };
    this.slug = { type: 'varchar' };
    this.permissionResourceId = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'Permission',
  tableName: 'permissions',
  columns: new Permission(),
  relations: {
    permissionResource: {
      type: 'many-to-one',
      target: 'permissionResource',
      inverseSide: 'permission_resources',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
