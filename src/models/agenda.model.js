const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Agenda extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.title = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'Agenda',
  tableName: 'agendas',
  columns: new Agenda(),
  
  relations: {
    mom: {
        type: "many-to-one", 
        target: "minute_of_meetings", // Target entity name (name of the related entity)
        inverseSide: "agendas", // Property name on the related entity that points back to Post
      },   
  },
});
