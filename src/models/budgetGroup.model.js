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
    this.approval_stage = { type: 'varchar', nullable: true };
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
  },
});
