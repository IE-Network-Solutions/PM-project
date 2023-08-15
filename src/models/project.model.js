const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class Project extends Base {
  // Define additional properties specific to Project entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.name = { type: 'varchar' };
    this.milestone = { type: 'text' };
    this.budget = { type: 'text' };
    this.contract_sign_date = { type: 'text' };
    this.planned_end_date = { type: 'text' };
    this.lc_opening_date = { type: 'text' };
    this.advanced_payment_date = { type: 'text' };
    this.status = { type: 'text' };
  }
}

module.exports = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
  columns: new Project(),

});
