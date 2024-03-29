const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class budgetType extends Base {
  // Define additional properties specific to budgetType entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.budgetTypeName = { type: 'varchar' };
    // this.isOffice = { type: "boolean", default: false };

  }
}

module.exports = new EntitySchema({
  name: 'budgetType',
  tableName: 'budget_type',
  columns: new budgetType(),
  relations: {
    paymentTerm: {
      type: "one-to-many",
      target: "PaymentTerm",
      inverseSide: "budgetType"
    },

  }
});
