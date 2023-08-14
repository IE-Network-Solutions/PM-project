const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class Task extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.name = { type: 'varchar' };
    this.plannedStart = { type: 'text' };
    this.plannedFinish = { type: 'text' };
    this.actualStart = { type: 'text' };
    this.actualFinish = { type: 'text' };
    this.completion = { type: 'text' };
    this.plannedCost = { type: 'text' };
    this.actualCost = { type: 'text' };
    this.status = { type: 'text' };
    this.plannedStart = { type: 'text' };
    this.sleepingReason = { type: 'text' };

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
