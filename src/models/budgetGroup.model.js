const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class BudgetGroup extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.from = { type: 'date' };
    this.to = { type: 'date' };
    this.approved = { type: 'boolean', default: false };
    this.rejected = { type: 'boolean', default: false };
  }
}

module.exports = new EntitySchema({
  name: 'BudgetGroup',
  tableName: 'budget_group',
  columns: new BudgetGroup(),
  relations: {
    comments: {
      type: 'many-to-many',
      target: 'BudgetComment',
      joinTable: {
        name: 'budgetGroupComment',
        joinColumn: {
          name: 'budgetGroupId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'budgetCommentId',
          referencedColumnName: 'id',
        },
      },
    },
    approvalStage: {
      type: 'many-to-one',
      target: 'ApprovalStage',
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
      onDelete: 'CASCADE',
    },
  },
});
