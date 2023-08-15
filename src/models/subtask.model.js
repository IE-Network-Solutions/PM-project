const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class SubTask extends Base {
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
  name: 'SubTask',
  tableName: 'subtasks',
  columns: new SubTask(),
  relations: {
    task: {
        type: "many-to-one", 
        target: "tasks", // Target entity name (name of the related entity)
        inverseSide: "subtasks", // Property name on the related entity that points back to Post
      },
  },
});
