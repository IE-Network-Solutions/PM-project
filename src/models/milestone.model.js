const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')


class Milestone extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.status = { type: 'boolean', default: true };
    this.weight = { type: 'int', nullable: true };
    this.projectId = { type: 'uuid' };
    this.paymentTermId = { type: 'uuid', nullable: true };
    this.hasCheckList = { type: "boolean", default: false };
    this.isEvaluted = { type: "boolean", default: false };
    this.isSendToDOO = { type: "boolean", default: false };
    this.plannedStart = { type: 'date', nullable: true };
    this.plannedFinish = { type: 'date', nullable: true };
    this.startVariance = { type: 'int', nullable: true }
    this.finishVariance = { type: 'int', nullable: true };
    this.actualStart = { type: 'date', nullable: true };
    this.actualFinish = { type: 'date', nullable: true };

  }
}

module.exports = new EntitySchema({
  name: 'Milestone',
  tableName: 'milestones',
  columns: new Milestone(),
  relations: {
    project: {
      type: "many-to-one",
      target: "projects",
      inverseSide: "milestones",
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    paymentTerm: {
      type: "many-to-one",
      target: "PaymentTerm",
      inverseSide: "milestones",
    },
    baseline: {
      type: "one-to-many",
      target: "Baseline",
      inverseSide: "milestone",
      onDelete: 'CASCADE',
    },
    summaryTask: {
      type: 'one-to-many',
      target: 'SummaryTask',
      inverseSide: 'milestone',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tasks: {
      type: 'one-to-many',
      target: 'Task',
      inverseSide: 'milestone',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    criteria: {
      type: 'many-to-many',
      target: 'Criteria',
      joinTable: {
        name: 'milestone_criteria',
        joinColumn: { name: 'milestoneId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'criteriaId', referencedColumnName: 'id' },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

  },
});
