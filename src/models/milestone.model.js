const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Milestone extends Base {
  constructor() {
    super(); 
    this.name = { type: 'varchar' };
    this.status = { type: 'varchar' };
    this.weight = { type: 'int', default: () => "NULL"};
    this.projectId = { type: 'uuid'};
    this.paymentTermId = { type: 'uuid', nullable: true};
  }
}

module.exports = new EntitySchema({
  name: 'Milestone',
  tableName: 'milestones',
  columns: new Milestone(),
  relations: {
    project: {
        type: "many-to-one", 
        target: "projects",
        inverseSide: "milestones",
      },  
      paymentTerm: {
        type: "many-to-one", 
        target: "PaymentTerm",
        inverseSide: "milestones",
      },   
  },
});
