const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class budgetSession extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.startDate = { type: 'date' };
    this.endDate = { type: 'date' };
    this.isActive = { type: 'boolean' };
  }
}

module.exports = new EntitySchema({
  name: 'budgetSession',
  tableName: 'budget_sessions',
  columns: new budgetSession(),
});
