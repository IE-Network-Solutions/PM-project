const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class budgetCategoryType extends Base {
  // Define additional properties specific to Post entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetCategoryTypeName = { type: 'varchar' };
    this.budgetCategoryTypeSlug = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'budgetCategoryType',
  tableName: 'budget_category_type',
  columns: new budgetCategoryType(),
});