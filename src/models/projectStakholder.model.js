const { EntitySchema } = require('typeorm');

const ProjectStakholder = new EntitySchema({
  name: 'ProjectStakholder',
  tableName: "projects_stakholders",
  columns: {
    projectId: {
        type: 'uuid',
       primary: true,
      },
    stakholderId: {
     primary:true,
     type: 'uuid',
      
    },
   
  },
  relations: {
    stakholder: {
      type: 'many-to-one',
      target: 'Stakholder',
    //  inverseSide: 'project',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    },
    project: {
      type: 'many-to-one',
      target: 'Project',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
 
  },
});

module.exports = ProjectStakholder;
