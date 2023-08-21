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
    //   milestone: {
    //     type: "one-to-many", 
    //     target: "Milestone", 
    //     inverseSide: "paymentTerm",
    //   },   
  },
});