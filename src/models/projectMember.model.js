const { EntitySchema } = require('typeorm');

const ProjectMember = new EntitySchema({
  name: 'ProjectMember',
  columns: {
    userId: {
      type: 'uuid',
      primary: true,
    },
    projectId: {
      type: 'uuid',
      primary: true,
    },
    roleId: {
      type: 'uuid',
      nullable: true,
      // primary: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
    },
    role: {
      type: 'many-to-one',
      target: 'Role',
    },
  },
});

module.exports = ProjectMember;
