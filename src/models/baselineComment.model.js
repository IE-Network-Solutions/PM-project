const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class BaselineComment extends Base {
  constructor() {
    super(); 
    this.comment = { type: 'varchar' };
    this.baselineId = { type: 'uuid'};
    this.userId = { type: 'uuid'};
  }
}

module.exports = new EntitySchema({
  name: 'BaselineComment',
  columns: new BaselineComment(),
  relations: {
      baseline: {
        type: "many-to-one", 
        target: "Baseline", 
        inverseSide: "baselineComment",
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
  },
});
