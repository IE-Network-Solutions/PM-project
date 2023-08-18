const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Milestone extends Base {
  constructor() {
    super(); 
    this.name = { type: 'varchar' };
    this.status = { type: 'varchar' };
    this.weight = { type: 'int', default: () => "NULL"  };
    this.projectId = { type: 'uuid',};
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
  },
});
