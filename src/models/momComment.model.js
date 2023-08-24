const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class MomComment extends Base {
  constructor() {
    super(); 
    this.comment = { type: 'varchar' };
    this.momId = { type: 'uuid'};
    this.userId = { type: 'uuid'};
    this.mentionedId = { type: 'uuid'};
  }
}

module.exports = new EntitySchema({
  name: 'MomComment',
  columns: new MomComment(),
  relations: {
      mom: {
        type: "many-to-one", 
        target: "minuteOfMeeting", 
        inverseSide: "momComment",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },   
      user: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "userComment",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },   
      mentioned: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "commentMentioned",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },   
  },
});
