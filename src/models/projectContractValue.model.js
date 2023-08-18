const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class ProjectContractValue extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.amount = { type: 'int' };
    this.currency = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'ProjectContractValue',
  tableName: 'project_contract_values',
  columns: {
    ...new ProjectContractValue(),
    projectId: { type: 'uuid', nullable: false },
  },
  relations: {
    project: {
        type: "many-to-one", 
        target: "projects",
        inverseSide: "projectContractValues",
      },   
  },
});
