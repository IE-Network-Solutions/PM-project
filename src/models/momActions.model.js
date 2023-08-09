const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class momAction extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.action = { type: 'varchar', nullable: true };
    this.responsiblePersonId = { type: 'varchar', nullable: true };
    this.responsiblePersonName = { type: 'varchar', nullable: true };
    this.deadline = { type: 'varchar', nullable: true};
  }
}

module.exports = new EntitySchema({
  name: 'momAction',
  tableName: 'mom_actions',
  columns: new momAction(),
  relations: {
    mom: {
        type: "many-to-one", 
        target: "minute_of_meetings", // Target entity name (name of the related entity)
        inverseSide: "mom_actions", // Property name on the related entity that points back to Post
      },   
  },
});
