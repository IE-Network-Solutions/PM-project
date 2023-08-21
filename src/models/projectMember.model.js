// // ProjectMember.js
// const { EntitySchema } = require('typeorm');
// const { Base } = require('./BaseModel');

// class ProjectMember extends Base {
//   constructor() {
//     super();
//     this.id = { type: 'uuid', primary: true };
//     this.roleId = { type: 'uuid', nullable: true };
//     this.projectId = { type: 'uuid' };
//     this.userId = { type: 'uuid' };
//   }
// }

// module.exports = new EntitySchema({
//   name: 'ProjectMember',
//   tableName: 'project_member',
//   columns: new ProjectMember(),
//   // relations: {
//   //   project: {
//   //     type: 'many-to-one',
//   //     target: 'Project',
//   //     inverseSide: 'ProjectMember',
//   //   },
//   //   user: {
//   //     type: 'many-to-one',
//   //     target: 'User',
//   //     inverseSide: 'ProjectMember',
//   //   },
//   // },

//   relations: {
//     user: {
//       type: 'many-to-one',
//       target: 'User',
//       joinColumn: { name: 'userId', referencedColumnName: 'id' },
//     },
//     project: {
//       type: 'many-to-one',
//       target: 'Project',
//       joinColumn: { name: 'projectId', referencedColumnName: 'id' },
//     },
//   },
// });

const { EntitySchema } = require("typeorm");

const ProjectMember = new EntitySchema({
  name: "ProjectMember",
  columns: {
    userId: {
      type: "uuid",
      primary: true,
    },
     projectId: {
      type: "uuid",
      primary: true,
    },
     roleId: {
      type: "uuid",
      primary: true,
      nullable: true
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
