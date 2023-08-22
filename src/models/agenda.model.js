const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Agenda extends Base {
  
  constructor() {
    super(); 
    this.agenda = {type: 'varchar'}
  }
}

module.exports = new EntitySchema({
  name: 'Agenda',
  tableName: 'agendas',
  columns: new Agenda(),
  
  relations: {
    mom: {
        type: "many-to-one", 
        target: "minute_of_meetings", 
        inverseSide: "agendas", 
      },   
  },
});
