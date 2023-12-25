// project.model.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ProjectBudget extends Base {
  constructor() {
    super();
    this.amount = { type: 'float' }; 
  }
}

module.exports = new EntitySchema({
  name: 'ProjectBudget',
  tableName: 'project_budgets',
  columns: new ProjectBudget(),
  relations: {
    project: {
      type: 'many-to-one',
      target: 'Project',
    },
    budgetCategory: {
      type: 'many-to-one',
      target: 'budgetCategory',
    },
    currency: {
      type: 'many-to-one',
      target: 'Currency',
      },
    },
});
