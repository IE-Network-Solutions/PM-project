const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class AgendaTopic extends Base {
 constructor() {
    super(); 
    this.agendaPoints = { type: 'varchar' };
    this.userId = { type: 'uuid' };
    this.agendaId = { type: 'uuid' };
  }
}

module.exports = new EntitySchema({
  name: 'MomAgendaTopic',
  columns: new AgendaTopic(),
  
  relations: {
    agenda: {
        type: "many-to-one", 
        target: "MomAgenda", 
        inverseSide: "mom", 
      }, 
      user: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "agenda", 
      },   
  },
});
