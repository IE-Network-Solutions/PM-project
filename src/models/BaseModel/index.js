const { EntitySchema } = require('typeorm');

class Base {
  // Define common properties for all entities inheriting from Base
  constructor() {
    this.id = { primary: true, type: 'uuid', generated: 'uuid' };
    this.createdAt = { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' };
    this.updatedAt = { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' };
    this.createdBy = { type: 'varchar' , nullable: true};
    this.updatedBy = { type: 'varchar', nullable: true};
  }
}

module.exports = { Base };