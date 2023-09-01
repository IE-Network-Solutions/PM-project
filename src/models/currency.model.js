const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Currency {
  // Define additional properties specific to Milestone entity
  constructor() {
    this.id = {primary: true, type: 'varchar' };
    this.name = { type: 'varchar' ,nullable:true};
    this.code = { type: 'varchar' ,nullable:true};
    this.symbol = { type: 'varchar' ,nullable:true};
    this.exchange_rate = { type:'decimal',nullable:true};
    this.format = { type: 'varchar' ,nullable:true};
    this.active = { type: 'varchar' ,nullable:true};
    this.created_at = { type: 'varchar' ,nullable:true};
    this.updated_at = { type: 'varchar' ,nullable:true};
  }
}

module.exports = new EntitySchema({
  name: 'Currency',
  tableName: 'currency',
  columns: {
    ...new Currency(),
  },
});
