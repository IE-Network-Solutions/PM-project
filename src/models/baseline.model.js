const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Baseline extends Base {
  constructor() {
    super(); 
    this.name = { type: 'varchar' };
    this.status = { type: 'varchar' };
    this.milestoneId = { type: 'uuid', nullable: true};
  }
}

module.exports = new EntitySchema({
  name: 'Baseline',
  tableName: 'baselines',
  columns: new Baseline(),
  relations: {
    milestone: {
        type: "many-to-one", 
        target: "milestones",
        inverseSide: "baselines",
      },  
  },
});