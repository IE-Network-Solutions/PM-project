const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Permission extends Base {
  constructor() {
    super();
    this.permissionName = { type: 'varchar' };
    this.slug = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'Permission',
  tableName: 'permissions',
  columns: new Permission(),
});
