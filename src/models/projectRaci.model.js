const { EntitySchema } = require('typeorm');

const ProjectRaci = new EntitySchema({
  name: 'ProjectRaci',
  tableName: "projects_racis",
  columns: {
    projectId: {
        type: 'uuid',
       primary: true,
      },
    raciId: {
     primary:true,
     type: 'uuid',
      
    },
   
  },
  relations: {
    raci: {
      type: 'many-to-one',
      target: 'Raci',
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

module.exports = ProjectRaci;
