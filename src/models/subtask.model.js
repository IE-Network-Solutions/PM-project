const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class SubTask extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.plannedStart = { type: 'date', nullable: true };
    this.plannedFinish = { type: 'date', nullable: true };
    this.actualStart = { type: 'date', nullable: true };
    this.actualFinish = { type: 'date', nullable: true };
    this.completion = { type: 'int', nullable: true };
    this.plannedCost = { type: 'int', nullable: true };
    this.actualCost = { type: 'int', nullable: true };
    this.status = { type: 'boolean', nullable: true };
    this.sleepingReason = { type: 'varchar', nullable: true };
    this.taskId = { type: 'uuid', };
    this.predecessor = { type: "varchar", nullable: true }
  }
}

module.exports = new EntitySchema({
  name: 'SubTask',
  tableName: 'subtasks',
  columns: new SubTask(),
  relations: {
    task: {
      type: "many-to-one",
      target: "Task",
      inverseSide: "subtasks",
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});
