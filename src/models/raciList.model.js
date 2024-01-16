const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class RaciList extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar', nullable: true };
    this.describtion = { type: 'varchar', nullable: true };
  }
}

module.exports = new EntitySchema({
  name: 'RaciList',
  tableName: 'raciLists',
  columns: new RaciList(),
  relations: {
    raci: {
      type: 'one-to-many',
      target: 'Raci',
      mappedBy: 'raciList',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
})