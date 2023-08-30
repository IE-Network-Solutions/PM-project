const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class Role extends Base {
  constructor() {
    super(); 
    this.roleName = { type: 'varchar' };
    this.isProjectRole = { type: 'boolean'};
  }
}

module.exports = new EntitySchema({
  name: 'Role',
tableName: 'roles',
  columns: new Role(),
  relations: {
      user: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "role",
      },   

      projectMember: {
        type: "one-to-many", 
        target: "ProjectMember", 
        inverseSide: "role",
      },   
  },
});
