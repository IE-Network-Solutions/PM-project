const { EntitySchema } = require('typeorm');

class TaskUser {
  // Define additional properties specific to TaskUser entity
  constructor() {
    this.taskId = { type: 'varchar', primary: true };
    this.userId = { type: 'varchar', primary: true };
  }
}

module.exports = new EntitySchema({
  name: 'TaskUser',
  tableName: 'taskUser',
  columns: new TaskUser(),
  relations: {
    task: {
      type: 'many-to-one',
      target: 'Task',
    },
    user: {
      type: 'many-to-one',
      target: 'User',
    },
  },
});
