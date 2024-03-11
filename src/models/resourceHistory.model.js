const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class ResourceHistory extends Base {
  constructor() {
    super(); 
    this.Action = { type: 'enum', enum: ['Created','Deleted'], nullable: true};
    this.projectId = { type: "varchar", nullable: true };
     this.taskId = { type: "varchar", nullable: true }; 
      this.userId = { type: "varchar", nullable: true }; 

  }
}

module.exports = new EntitySchema({
  name: 'ResourceHistory',
  tableName: 'resourcehistories',
  columns: new ResourceHistory(),
  relations: {
    user: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "resourcehistories", 
      },
      project: {
        type: "many-to-one", 
        target: "Project", 
        inverseSide: "resourcehistories", 
      },
      task: {
        type: "many-to-one", 
        target: "Task", 
        inverseSide: "resourcehistories", 
      },
  },
});
