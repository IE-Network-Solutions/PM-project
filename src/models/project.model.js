// project.model.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Project extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.clientId = { type: 'uuid', nullable: true };
    this.milestone = { type: 'int' };
    this.budget = { type: 'int' };
    this.contract_sign_date = { type: 'date' };
    this.planned_end_date = { type: 'date' };
    this.lc_opening_date = { type: 'date' };
    this.advanced_payment_date = { type: 'date' };
    this.status = { type: 'boolean' };
    this.isOffice = {type: 'boolean', default: false}
    
  }
}

module.exports = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
  columns: new Project(),
  relations: {
    projectContractValues: {
      type: 'one-to-many',
      target: 'ProjectContractValue',
      inverseSide: 'project',
    },
    weeklyReport: {
      type: 'one-to-many',
      target: 'WeeklyReport',
      inverseSide: 'project',
    },
  
    projectMembers: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'project_member',
        joinColumn: { name: 'projectId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
      },
    },
    client: {
      type: 'many-to-one',
      target: 'Client',
      inverseSide: 'project',
    },
  },
});
