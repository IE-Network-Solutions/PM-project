const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Budget extends Base {
  // Define additional properties specific to Budget entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.description = { type: 'text' };
    this.amount = { type: 'double precision' };
  }
}

module.exports = new EntitySchema({
  name: 'Budget',
  columns: new Budget(),
  relations: {
    group: {
      type: 'many-to-one',
      target: 'BudgetGroup',
    },
    task: {
      type: 'many-to-one',
      target: 'Task',
    },
    budgetCategory: {
      type: 'many-to-one',
      target: 'budgetCategory',
    },
    taskCategory: {
      type: 'many-to-one',
      target: 'budgetTaskCategory',
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
    },
  },
});
