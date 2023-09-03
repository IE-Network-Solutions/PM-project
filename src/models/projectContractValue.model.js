const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class ProjectContractValue extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.amount = { type: 'int' };
  }
}

module.exports = new EntitySchema({
  name: 'ProjectContractValue',
  tableName: 'project_contract_values',
  columns: {
    ...new ProjectContractValue(),
  },
  relations: {
    project: {
        type: "many-to-one", 
        target: "Project",
        inverseSide: "projectContractValues",
      },
      currency: {
        type: "many-to-one", 
        target: "Currency",
        inverseSide: "projectContractValues",
      },  
  },
});
