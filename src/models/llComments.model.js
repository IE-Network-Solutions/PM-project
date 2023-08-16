const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');



class LLComments extends Base {
    // Define additional properties specific to individual lesson learned entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.userName = { type: 'varchar' };
        this.userId = { type: 'varchar' };
        this.comment = { type: 'text' };
        this.LLId = { type: 'varchar', nullable: true };
        this.date = { type: 'varchar' };
    }
}

module.exports = new EntitySchema({
    name: 'LLComments',
    tableName: 'llComments',
    columns: new LLComments(),
    relations: {
        lessonLearned: {
            type: 'many-to-one',
            target: 'LessonLearned',
            joinColumn: {
                name: "LLId",
                referencedColumnName: "id"
            },
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
    },
});
