// project.model.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ProjectBudget extends Base {
  constructor() {
    super();
    this.amount = { type: 'float' };
    this.projectId = { type: 'varchar' };
    this.currencyId = { type: 'varchar' };
    this.budgetCategoryId = { type: 'varchar' };
    this.usedAmount = { type: 'float', default: 0 };
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
      onDelete: 'CASCADE',
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
