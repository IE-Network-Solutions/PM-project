const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Agenda extends Base {
  
  constructor() {
    super(); 
    this.agenda = {type: 'varchar'}
  }
}

module.exports = new EntitySchema({
  name: 'MomAgenda',
  columns: new Agenda(),
  
  relations: {
    mom: {
        type: "many-to-one", 
        target: "minuteOfMeeting", 
        inverseSide: "agenda", 
      },   
    user: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "agenda", 
      },   
  },
});
