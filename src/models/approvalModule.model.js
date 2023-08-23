const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ApprovalModule extends Base {
  constructor() {
    super();
    this.moduleName = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'ApprovalModule',
  tableName: 'approval_module',
  columns: new ApprovalModule(),
});
