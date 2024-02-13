// project.model.js
const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Project extends Base {
  constructor() {
    super();
    this.name = { type: 'varchar' };
    this.clientId = { type: 'uuid', nullable: true };
    this.milestone = { type: 'int', nullable: true };
    this.budget = { type: 'int', nullable: true };
    this.contract_sign_date = { type: 'date', nullable: true };
    this.planned_end_date = { type: 'date', nullable: true };
    this.lc_opening_date = { type: 'date', nullable: true };
    this.advanced_payment_date = { type: 'date', nullable: true };
    this.status = { type: 'boolean', nullable: true };

    this.plannedStart = { type: 'date', nullable: true };
    this.plannedFinish = { type: 'date', nullable: true };
    this.startVariance = { type: 'int', nullable: true }
    this.finishVariance = { type: 'int', nullable: true };
    this.actualStart = { type: 'date', nullable: true };
    this.actualFinish = { type: 'date', nullable: true };
    this.isOffice = { type: 'boolean', default: false }

  }
}

module.exports = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
  columns: new Project(),
  relations: {
    projectContractValues: {
      type: 'one-to-many',
      target: 'ProjectContractValue',
      inverseSide: 'project',
    },
    weeklyReport: {
      type: 'one-to-many',
      target: 'WeeklyReport',
      inverseSide: 'project',
    },

    projectMembers: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'project_member',
        joinColumn: { name: 'projectId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
      },
    },
    projectStakholders: {
      type: 'many-to-many',
      target: 'Stakholder',
      joinTable: {
        name: 'projects_stakholders',
        joinColumn: { name: 'projectId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'stakholderId',
          referencedColumnName: 'id',
        },
      },
    },
    projectRacis: {
      type: 'many-to-many',
      target: 'Raci',
      joinTable: {
        name: 'projects_racis',
        joinColumn: { name: 'projectId', referencedColumnName: 'id' },
        inverseJoinColumn: {
          name: 'raciId',
          referencedColumnName: 'id',
        },
      },
    },
  
    client: {
      type: 'many-to-one',
      target: 'Client',
      inverseSide: 'project',
    },
    baslineHistory: {
      type: 'one-to-many',
      target: 'BaselineHistory',
      inverseSide: 'project',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

  },
});
