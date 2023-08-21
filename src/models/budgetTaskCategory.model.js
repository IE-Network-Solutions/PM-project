const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class budgetTaskCategory extends Base {
  // Define additional properties specific to budgetTask Category entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetTaskCategoryName = { type: 'varchar' };
    this.accountNumber = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'budgetTaskCategory',
  tableName: 'budget_task_category',
  columns: new budgetTaskCategory(),
  relations: {
    budgetType: {
      type: 'many-to-one',
      target: 'budgetType',
      joinColumn: {
        name: 'budgetTypeId',
        referencedColumnName: 'id',
      },
    },
  },
});
