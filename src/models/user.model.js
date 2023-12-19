const { EntitySchema } = require('typeorm');

class User {
  constructor() {
    this.id = { primary: true, type: 'uuid' };
    this.name = { type: 'varchar' };
    this.roleId = { type: 'varchar', nullable: true };
    this.email = { type: 'varchar' };
    this.emailVerifiedAt = { type: 'timestamp', nullable: true };
    this.password = { type: 'varchar', nullable: true };
    this.avatar = { type: 'varchar', nullable: true };
    this.signature = { type: 'varchar', nullable: true };
    this.isDeleted = { type: 'bool', nullable: true };
    this.rememberToken = { type: 'text', nullable: true };
    this.createdAt = { type: 'timestamp' };
    this.updatedAt = { type: 'timestamp' };
  }
}

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: new User(),
  relations: {
    role: {
      type: 'many-to-one',
      target: 'Role',
      inverseSide: 'user',
    },
    tasks: {
      type: 'many-to-many',
      target: 'Task',
      joinTable: {
        name: 'taskUser',
        joinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'taskId',
          referencedColumnName: 'id',
        },
      },
    },
    projects: {
      type: 'many-to-many',
      target: 'Project',
      joinTable: {
        name: 'project_member',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'projectId',
          referencedColumnName: 'id',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    mom: {
      type: 'many-to-many',
      target: 'minuteOfMeeting',
      joinTable: {
        name: 'mom_attendees',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'momId',
          referencedColumnName: 'id',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    momFacilitator: {
      type: 'one-to-many',
      target: 'minuteOfMeeting',
      inverseSide: 'facilitator',
    },
    userComment: {
      type: 'one-to-many',
      target: 'MomComment',
      inverseSide: 'user',
    },
    reportComment: {
      type: 'one-to-many',
      target: 'WeeklyReportComment',
      inverseSide: 'user',
    },
    llcomment: {
      type: 'one-to-many',
      target: 'LLComments',
      inverseSide: 'user',
    },
    resourceOn: {
      type: 'many-to-many',
      target: 'Task',
      joinTable: {
        name: 'taskUser',
        joinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'taskId',
          referencedColumnName: 'id',
        },
      },
    },
    permissions: {
      type: 'many-to-many',
      target: 'Permission',
      joinTable: {
        name: 'permission_user',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'permissionId',
          referencedColumnName: 'id',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
});
