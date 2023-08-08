const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class Task extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.name = { type: 'varchar' };
    this.plannedStart = { type: 'date' };
    this.plannedFinish = { type: 'date' };
    this.actualStart = { type: 'date' };
    this.actualFinish = { type: 'date' };
    this.completion = { type: 'int' };
    this.plannedCost = { type: 'int' };
    this.actualCost = { type: 'int' };
    this.status = { type: 'boolean' };
    this.sleepingReason = { type: 'varchar', default: () => "NULL"};

  }
}

module.exports = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: new Task(),
  relations: {
    milestone: {
        type: "many-to-one", 
        target: "milestones", // Target entity name (name of the related entity)
        inverseSide: "tasks", // Property name on the related entity that points back to Post
      },
  },
});
