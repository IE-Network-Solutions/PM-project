// ProjectMember.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ProjectMember extends Base {
  constructor() {
    super();
    this.roleId = { type: 'uuid' };
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
      inverseSide: 'projectMembers', // Assuming 'projectMembers' is the inverse side property in the Project entity
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'projectMembers', // Assuming 'projectMembers' is the inverse side property in the Project entity
    },
  },
});
