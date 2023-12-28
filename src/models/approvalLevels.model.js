const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ApprovalLevel extends Base {
  constructor() {
    super();
    this.levelName = { type: 'varchar' };
    this.isMultiple = { type: 'boolean', default: false };
    this.count = { type: 'int' };
  }
}

module.exports = new EntitySchema({
  name: 'ApprovalLevel',
  tableName: 'approval_level',
  columns: new ApprovalLevel(),
});
