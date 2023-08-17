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
  projectMembers: {
    type: 'one-to-many',
    target: 'ProjectMember',
    inverseSide: 'User',
  },
});
