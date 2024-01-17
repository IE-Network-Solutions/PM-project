const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class PermissionResource extends Base {
  constructor() {
    super();
    this.id = { primary: true, type: 'integer' };
    this.permissionResourceName = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'permissionResource',
  tableName: 'permission_resources',
  columns: new PermissionResource(),
});
