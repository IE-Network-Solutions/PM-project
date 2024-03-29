const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class PaymentTerm extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.amount = { type: 'float'};
    this.plannedCollectionDate = {type: 'date', nullable: true}
    this.actualCollectionDate = {type: 'date', nullable: true}
    this.status = { type: 'boolean', default: true};
    this.projectId = {type: 'boolean'}
    this.currencyId = {type: 'varchar', nullable: true}
    this.isOffshore = {type: 'boolean'}
    this.isAmountPercent = {type: 'boolean', default: false}
    this.budgetTypeId = {type: 'boolean', nullable: true}
    this.atpDocument ={type:'varchar', nullable: true}
    this.milestone ={type:'varchar', nullable:true}
    this.isAdvance ={type:'boolean', default:false}
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
      currency: {
        type: "many-to-one",
        target: "Currency",
        inverseSide: "paymentTerm",
      },
      budgetType: {
        type: "many-to-one",
        target: "budgetType",
        inverseSide: "paymentTerm"
      }
  },
});
