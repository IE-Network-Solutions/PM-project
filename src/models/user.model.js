const { EntitySchema } = require('typeorm');

class User {
  constructor() {
    this.id = { primary: true, type: 'uuid' };
    this.name = { type: 'varchar' };
    this.roleId = { type: 'varchar', nullable: true };
    this.email = { type: 'varchar' };
    this.emailVerifiedAt = { type: 'timestamp', nullable: true };
    this.password = { type: 'varchar' };
    this.avatar = { type: 'varchar', nullable: true };
    this.signature = { type: 'varchar', nullable: true };
    this.isDeleted = { type: 'bool' };
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
    role:{
      type: 'one-to-many',
      target: 'Role',
      inverseSide: 'user'
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
      }},
    projects: {
      type: "many-to-many",
      target: "Project",
      joinTable: {
        name: "project_member",
        joinColumn: { name: "userId", referencedColumnName: "id" },
        inverseJoinColumn: {
          name: "projectId",
          referencedColumnName: "id",
        },
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    mom: {
      type: "many-to-many",
      target: "minuteOfMeeting",
      joinTable: {
        name: "mom_attendees",
        joinColumn: { name: "userId", referencedColumnName: "id" },
        inverseJoinColumn: {
          name: "momId",
          referencedColumnName: "id",
        },
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    momFacilitator: {
      type: "one-to-many", 
      target: "minuteOfMeeting", 
      inverseSide: "facilitator", 
    }, 
    userComment: {
      type: "one-to-many", 
      target: "MomComment", 
      inverseSide: "user", 
    }, 
    commentMentioned: {
      type: "one-to-many", 
      target: "MomComment", 
      inverseSide: "mentioned", 
    }, 
  },
});
