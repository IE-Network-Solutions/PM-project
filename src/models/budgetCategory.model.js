const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class budgetCategory extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetCategoryName = { type: 'varchar' };
    this.accountNumber = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'budgetCategory',
  tableName: 'budget_category',
  columns: new budgetCategory(),
});
