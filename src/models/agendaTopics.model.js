const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class AgendaTopic extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.agenda_points = { type: 'varchar' };
    this.userId = { type: 'varchar' };
    this.userName = { type: 'varchar' };
    this.signature = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'AgendaTopic',
  tableName: 'agenda_topics',
  columns: new AgendaTopic(),
  relations: {
    agenda: {
        type: "many-to-one", 
        target: "agendas", // Target entity name (name of the related entity)
        inverseSide: "agenda_topics", // Property name on the related entity that points back to Post
      },   
  },
});
