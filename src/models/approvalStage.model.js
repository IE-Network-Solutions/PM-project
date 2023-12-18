const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ApprovalStage extends Base {
  constructor() {
    super();
    this.level = { type: 'int' };
    this.project_role = { type: 'boolean', default: false };
  }
}

module.exports = new EntitySchema({
  name: 'ApprovalStage',
  tableName: 'approval_stage',
  columns: new ApprovalStage(),
  relations: {
    role: {
      type: 'many-to-one',
      target: 'Role',
    },
    approvalModule: {
      type: 'many-to-one',
      target: 'ApprovalModule',
    },
  },
});
