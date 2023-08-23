const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Agenda extends Base {
  
  constructor() {
    super(); 
    this.agenda = {type: 'varchar'}
    this.momId = {type: 'uuid'}
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
      momTopics: {
        type: "one-to-many", 
        target: "MomAgendaTopic", 
        inverseSide: "agenda", 
      },   
    // user: {
    //     type: "many-to-one", 
    //     target: "User", 
    //     inverseSide: "agenda", 
    //   },   
  },
});
