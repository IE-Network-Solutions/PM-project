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
      },   
  },
});
