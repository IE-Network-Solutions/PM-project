const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class PaymentTerm extends Base {
  constructor() {
    super(); 
    this.name = { type: 'varchar' };
    this.amount = { type: 'int'};
    this.plannedCollectionDate = {type: 'date', nullable: true}
    this.actualCollectionDate = {type: 'date', nullable: true}
    this.status = { type: 'boolean' };
    this.projectId = {type: 'boolean'}
    this.currencyId = {type: 'varchar', nullable: true}
  }
}

module.exports = new EntitySchema({
  name: 'PaymentTerm',
//   tableName: 'milestones',
  columns: new PaymentTerm(),
  relations: {
      milestone: {
        type: "one-to-many", 
        target: "Milestone", 
        inverseSide: "paymentTerm",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      project: {
        type: "many-to-one", 
        target: "Project", 
        inverseSide: "paymentTerm",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },   
  },
});
