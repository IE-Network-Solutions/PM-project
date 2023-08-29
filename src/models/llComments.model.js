const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');



class LLComments extends Base {
    // Define additional properties specific to individual lesson learned entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.userId = { type: 'varchar' };
        this.comment = { type: 'text' };
        this.lessonLearnedId = { type: 'varchar', nullable: true };
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
            inverseSide: "llComments",
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
        // user: {
        //     type: 'many-to-one',
        //     target: 'User',
        //     onDelete: "SET NULL",
        //     onUpdate: 'CASCADE'
        // },
    },
});
