const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')



class StakHolder extends Base {
  constructor() {
    super(); 
    this.stakeholder_name = { type: 'varchar',nullable: true};
    this.title = { type: 'varchar',nullable: true};
    this.email = { type: "varchar", nullable: true };
     this.phone_number = { type: "varchar", nullable: true }; 
     this.project_role = { type: "varchar", nullable: true }; 
     this.influence = { type: "varchar", nullable: true }; 
     this.impact = { type: "varchar", nullable: true }; 
     this.matrix = { type: "varchar", nullable: true }; 
     this.support = { type: "varchar", nullable: true }; 
     this.engage_stakeholder = { type: "varchar", nullable: true }; 
     this.decision_maker = { type: "varchar", nullable: true }; 
     this.communication_frequency = { type: "varchar", nullable: true }; 
     this.ways_of_communication = { type: "varchar", nullable: true }; 
     this.remark = { type: "varchar", nullable: true }; 
     this.isDeleted = {  type: "boolean",  default: false,  nullable: true 
    };

  }
}

module.exports = new EntitySchema({
  name: 'Stakholder',
  tableName: 'stakholders',
  columns: new StakHolder(),
  relations: {
    projects: {
        type: 'many-to-many',
        target: 'Project',
        joinTable: {
          name: 'projects_stakholders',
          joinColumn: { name: 'stakholderId', referencedColumnName: 'id' },
          inverseJoinColumn: {
            name: 'projectId',
            referencedColumnName: 'id',
          },
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }},
      //task: {
//         type: "many-to-one", 
//         target: "Task", 
//         inverseSide: "resourcehistories", 
//       },
//   },
});

