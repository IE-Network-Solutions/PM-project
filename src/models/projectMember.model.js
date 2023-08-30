
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
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'role',
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
    },
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    },
  },
});

module.exports = ProjectMember;
