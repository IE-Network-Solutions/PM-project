const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class ProjectContractValue extends Base {
  constructor() {
    super();
    this.amount = { type: 'int' };
    this.currencyId = {type: 'uuid'}
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      currency: {
        type: "many-to-one", 
        target: "Currency",
        inverseSide: "projectContractValues",
      },  
  },
});
