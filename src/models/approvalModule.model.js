const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ApprovalModule extends Base {
  constructor() {
    super();
    this.moduleName = { type: 'varchar' };
    this.max_level = { type: 'int', nullable: true };
  }
}

module.exports = new EntitySchema({
  name: 'ApprovalModule',
  tableName: 'approval_module',
  columns: new ApprovalModule(),
});
