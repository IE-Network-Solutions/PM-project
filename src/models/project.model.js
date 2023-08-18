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
    projectContractValues: {
      type: 'one-to-many',
      target: 'ProjectContractValue', // Corrected target entity name
      inverseSide: 'project', // Corrected inverse side property name
    },
    projectMembers: {
      type: "many-to-many",
      target: "User",
      joinTable: {
        name: "project_member",
        joinColumn: { name: "projectId", referencedColumnName: "id" },
        inverseJoinColumn: {
          name: "userId",
          referencedColumnName: "id",
        },
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  
});
