// ProjectMember.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ProjectMember extends Base {
  constructor() {
    super();
    this.roleId = { type: 'uuid' };
    this.projectId = { type: 'uuid' };
    this.userId = { type: 'uuid' };
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
      inverseSide: 'projectMembers',
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'projectMembers',
    },
  },
});
