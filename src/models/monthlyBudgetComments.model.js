const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class MonthlyBudgetComment extends Base {
  // Define additional properties specific to budget comment entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetComment = { type: 'text' };
    this.userId = { type: 'text', default:null };
  }
}

module.exports = new EntitySchema({
  name: 'MonthlyBudgetComment',
  tableName: 'monthly_budget_comments',
  columns: new MonthlyBudgetComment(),
  relations: {
    monthlyBudget: {
        type: 'many-to-one',
        target: 'MonthlyBudget',
    },
    user: {
      type: 'many-to-one',
      target: 'User'
  },
}
});
