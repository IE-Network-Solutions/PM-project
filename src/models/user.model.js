const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class User {
  // Define additional properties specific to Project entity
  constructor() {
    this.id = { primary: true, type: 'uuid' };
    this.name = { type: 'varchar' };
    this.roleId = { type: 'varchar' };
    this.email = { type: 'varchar' };
    this.emailVerifiedAt = { type: 'timestamp',nullable: true };
    this.password = { type: 'varchar' };
    this.avatar = { type: 'varchar',nullable: true };
    this.signature = { type: 'varchar' };
    this.isDeleted = { type: 'bool' ,};
    this.rememberToken = { type: 'text',nullable: true };
    this.createdAt = { type: 'timestamp' };
    this.updatedAt = { type: 'timestamp' };
  }
}

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: new User(),
  relations: {
    // projectMembers: {
    //   type: 'one-to-many',
    //   target: 'ProjectMember',
    //   inverseSide: 'Project',
    // },
    // projectContractValues: { // Change to projectContractValues
    //   type: 'one-to-many',
    //   target: 'ProjectContractValue',
    //   inverseSide: 'Project', // Assuming this is the correct inverseSide property
    // },
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
  },
});
