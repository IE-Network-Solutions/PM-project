const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Baseline extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.status = { type: 'boolean', default: true };
    this.projectId = { type: 'uuid', nullable: true };
    this.approved = { type: 'boolean', default: false };
    this.rejected = { type: 'boolean', default: false };
  }
}

module.exports = new EntitySchema({
  name: 'Baseline',
  tableName: 'baselines',
  columns: new Baseline(),
  relations: {
    project: {
      type: 'many-to-one',
      target: 'projects',
      inverseSide: 'baselines',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tasks: {
      type: 'one-to-many',
      target: 'Task',
      inverseSide: 'baseline',
    },
    baselineComment: {
      type: 'one-to-many',
      target: 'BaselineComment',
      inverseSide: 'baseline',
    },
    approvalStage: {
      type: 'many-to-one',
      target: 'ApprovalStage',
    },
  },
});
