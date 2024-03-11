const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class BudgetComment extends Base {
  // Define additional properties specific to budget comment entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetComment = { type: 'text' };
  }
}

module.exports = new EntitySchema({
  name: 'BudgetComment',
  tableName: 'budget_comment',
  columns: new BudgetComment(),
  budgets: {
    type: 'many-to-many',
    target: 'BudgetGroup',
    joinTable: {
      name: 'budgetGroupComment',
      joinColumn: {
        name: 'budgetCommentId',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'budgetGroupId',
        referencedColumnName: 'id',
      },
    },
  },
});
