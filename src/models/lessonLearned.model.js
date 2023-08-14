const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');



class LessonLearned extends Base {
    // Define additional properties specific to lesson learned entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.name = { type: 'varchar' };
        this.PMOMName = { type: 'varchar' };
        this.PMOMId = { type: 'varchar' };
        this.PMName = { type: 'varchar' };
        this.PMId = { type: 'varchar' };
        this.date = { type: 'varchar' };
        this.status = { type: 'varchar' };
        this.projectId = { type: 'varchar' }
    }
}

module.exports = new EntitySchema({
    name: 'LessonLearned',
    tableName: 'lessonLearned',
    columns: new LessonLearned(),
    relations: {
        individuals: {
            type: 'one-to-many',
            target: 'IndividualLL',
            inverseSide: 'lessonLearned',
        },
        projects: {
            type: 'many-to-one',
            target: 'Project',
            joinColumn: {
                name: "projectId",
                referencedColumnName: "id"
            },
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
    },
});
