const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Task extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.from = { type: 'date' };
    this.to = { type: 'date' };
    this.approved = { type: 'boolean' };
    this.rejected = { type: 'boolean' };
  }
}

module.exports = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: new Task(),
  relations: {
    milestone: {
      type: 'many-to-one',
      target: 'milestones', // Target entity name (name of the related entity)
      inverseSide: 'tasks', // Property name on the related entity that points back to Post
    },
    resources: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'taskUser',
        joinColumn: {
          name: 'taskId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
      },
    },
  },
});
