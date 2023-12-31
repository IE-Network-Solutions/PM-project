const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')


class Milestone extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.status = { type: 'boolean', default: true };
    this.plannedStart = { type: 'date', nullable: true };
    this.plannedFinish = { type: 'date', nullable: true };
    this.startVariance = { type: 'int', nullable: true }
    this.finishVariance = { type: 'int', nullable: true };
    this.actualStart = { type: 'date', nullable: true };
    this.actualFinish = { type: 'date', nullable: true };


    this.weight = { type: 'int', nullable: true };
    this.projectId = { type: 'uuid' };
    this.paymentTermId = { type: 'uuid', nullable: true };
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
  },
});
