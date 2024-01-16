const { EntitySchema, ManyToOne, ManyToMany, JoinTable } = require('typeorm');
const { Base } = require('./BaseModel');

class Raci extends Base {
  constructor() {
    super();
    this.project_tasks = { type: 'varchar', nullable: true };
    this.project_manager = { type: 'varchar', nullable: true };
    this.tech_team_lead = { type: 'varchar', nullable: true };
    this.doo = { type: 'varchar', nullable: true };
    this.pmom = { type: 'varchar', nullable: true };
    this.so = { type: 'varchar', nullable: true };
    this.lo = { type: 'varchar', nullable: true };
    this.pfo = { type: 'varchar', nullable: true };
    this.fe = { type: 'varchar', nullable: true };
    this.client = { type: 'varchar', nullable: true };
    this.ceo = { type: 'varchar', nullable: true };
  }
}

module.exports = new EntitySchema({
  name: 'Raci',
  tableName: 'racis',
  columns: new Raci(),
  relations: {
    raciList: {
      type: 'many-to-one',
      target: 'RaciList',
      onDelete: 'SET NULL',
      inverseSide: 'racis',
      onUpdate: 'CASCADE',
    },
    projects: {
      type: 'many-to-many',
      target: 'Project',
      joinTable: {
        name: 'projects_racis',
        joinColumn: { name: 'raciId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'projectId',
          referencedColumnName: 'id',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
});
