const { EntitySchema } = require('typeorm');

class BudgetGroupComment {
  // Define additional properties specific to BudgetGroupComment entity
  constructor() {
    this.budgetGroupId = { type: 'varchar', primary: true };
    this.budgetCommentId = { type: 'varchar', primary: true };
  }
}

module.exports = new EntitySchema({
  name: 'budgetGroupComment',
  tableName: 'budgetGroupComment',
  columns: new BudgetGroupComment(),
  relations: {
    budgetGroup: {
      type: 'many-to-one',
      target: 'BudgetGroup',
    },
    budgetComment: {
      type: 'many-to-one',
      target: 'BudgetComment',
    },
  },
});
