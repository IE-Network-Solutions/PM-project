const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class Task extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.name = { type: 'varchar' };
    this.plannedStart = { type: 'date' };
    this.plannedFinish = { type: 'date'};
    this.actualStart = { type: 'date' , nullable: true};
    this.actualFinish = { type: 'date', nullable: true };
    this.completion = { type: 'int' , nullable: true};
    this.plannedCost = { type: 'int' , nullable: true};
    this.actualCost = { type: 'int' , nullable: true};
    this.status = { type: 'boolean' , nullable: true};
    this.sleepingReason = { type: 'varchar', nullable: true};
    // this.milestoneId = { type: 'uuid', nullable: true};
    this.baselineId = { type: 'uuid'};

  }
}

module.exports = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: new Task(),
  relations: {
      baseline: {
        type: "many-to-one", 
        target: "Baseline", 
        inverseSide: "task", 
      },
      subtasks: {
        type: 'one-to-many',
        target: 'SubTask',
        inverseSide: 'task',
      },
  },
});
