const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');


class MonthlyBudget extends Base {
  // Define additional properties specific to Budget entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetsData = { type: 'json'};
    this.from = { type: 'date' };
    this.to = { type: 'date' };
    this.approved = { type: 'boolean', default: false };
    this.rejected = { type: 'boolean', default: false };    
  }
}

module.exports = new EntitySchema({
    name: 'MonthlyBudget',
    tableName: 'monthly_budgets',
    columns: new MonthlyBudget(),
    relations: {
        approvalStage: {
            type: 'many-to-one',
            target: 'ApprovalStage',
        },
        monthlyBudgetcomments: {
            type: 'one-to-many',
            target: 'MonthlyBudgetComment',
            inverseSide: 'monthlyBudget'
        },
    }
});
