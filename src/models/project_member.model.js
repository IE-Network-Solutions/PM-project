// ProjectMember.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ProjectMember extends Base {
  constructor() {
    super();
    this.roleId = { type: 'varchar' };
    this.roleName = { type: 'varchar' };
    this.memberId = { type: 'varchar' };
    this.memberName = { type: 'varchar' };
    this.projectId = { type: 'uuid' }; // Add this line for the foreign key
  }
}

module.exports = new EntitySchema({
  name: 'ProjectMember',
  tableName: 'project_member',
  columns: new ProjectMember(),
  relations: {
    project: {
      type: 'many-to-one',
      target: 'Project',
      joinColumn: { name: 'projectId', referencedColumnName: 'id' }, // Specify the join column
      inverseSide: 'projectMembers', // Assuming 'projectMembers' is the inverse side property in the Project entity
    },
  },
});
