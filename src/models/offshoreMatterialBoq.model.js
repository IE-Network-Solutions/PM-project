// project.model.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class ProjectOffshoreBoq extends Base {
  constructor() {
    super();
    this.boq = { type: 'varchar' };
    this.solutionId = { type: 'varchar' };
    this.boq_type = { type: 'varchar', nullable: true };
    this.projectId = { type: 'varchar' };
    this.currencyId = { type: 'int' };
    this.boqPath = { type: 'varchar' };
    this.idDeleted = { type: 'boolean' };
    this.createdBy = { type: 'varchar', nullable: true };
    this.updatedBy = { type: 'varchar', nullable: true };
    this.createdAt = { type: 'timestamp', nullable: true };
    this.updatedAt = { type: 'timestamp', nullable: true };
  }
}

module.exports = new EntitySchema({
  name: 'ProjectOffsoreMaterialBoq',
  tableName: 'project_offshore_material_boqs',
  columns: new ProjectOffshoreBoq(),
  relations: {
    project: {
      type: 'many-to-one',
      target: 'Project',
    },
    department: {
      type: 'many-to-one',
      target: 'Department',
    },
    currency: {
      type: 'many-to-one',
      target: 'Currency',
    },
  },
});
