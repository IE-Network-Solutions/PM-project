const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Milestone extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.name = { type: 'varchar' };
    this.status = { type: 'varchar' };
    this.weight = { type: 'int' };
  }
}

module.exports = new EntitySchema({
  name: 'Milestone',
  tableName: 'milestones',
  columns: new Milestone(),
  relations: {
    project: {
        type: "many-to-one", 
        target: "projects", // Target entity name (name of the related entity)
        inverseSide: "milestones", // Property name on the related entity that points back to Post
      },   
  },
});
