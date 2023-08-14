const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class Project extends Base {
  // Define additional properties specific to Project entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.name = { type: 'varchar' };
    this.milestone = { type: 'int' };
    this.budget = { type: 'int' };
    this.contract_sign_date = { type: 'date' };
    this.planned_end_date = { type: 'date' };
    this.lc_opening_date = { type: 'date' };
    this.advanced_payment_date = { type: 'date' };
    this.status = { type: 'boolean'};
  }
}

module.exports = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
  columns: new Project(),
  relations: {
    projectMembers: {
      type: 'one-to-many',
      target: 'ProjectMember', // Target entity name (name of the related entity)
      inverseSide: 'project', // Property name on the related entity that points back to Project
    },
  },

});
