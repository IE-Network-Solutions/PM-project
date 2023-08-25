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
      type: 'many-to-one',
      target: 'BudgetComment',
    },
    approvalStage: {
      type: 'many-to-many',
      target: 'ApprovalStage',
    },
    project: {
      type: 'many-to-many',
      target: 'Project',
    },
  },
});
