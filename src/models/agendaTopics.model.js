const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class AgendaTopic extends Base {
 constructor() {
    super(); 
    this.agendaPoints = { type: 'varchar' };
    this.userId = { type: 'varchar' };
  }
}

module.exports = new EntitySchema({
  name: 'AgendaTopic',
  tableName: 'agenda_topics',
  columns: new AgendaTopic(),
  
  relations: {
    agenda: {
        type: "many-to-one", 
        target: "agendas", 
        inverseSide: "agenda_topics", 
      },   
  },
});
