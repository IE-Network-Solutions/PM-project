// project.model.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Project extends Base {
  constructor() {
    super();
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
      target: 'ProjectMember',
      inverseSide: 'Project',
    },
    projectContractValues: { // Change to projectContractValues
      type: 'one-to-many',
      target: 'ProjectContractValue',
      inverseSide: 'Project', // Assuming this is the correct inverseSide property
    },
  },
  
});
