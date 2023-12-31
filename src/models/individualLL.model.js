const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');



class IndividualLL extends Base {
    // Define additional properties specific to individual lesson learned entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.LLOwnerName = { type: 'varchar' };
        this.LLOwnerId = { type: 'varchar' };
        this.problem = { type: 'text' };
        this.impact = { type: 'text' };
        this.lessonLearnedText = { type: 'text' };
        this.lessonLearnedId = { type: 'varchar', nullable: true };
    }
}

module.exports = new EntitySchema({
    name: 'IndividualLL',
    tableName: 'individualLL',
    columns: new IndividualLL(),
    relations: {
        lessonLearned: {
            type: 'many-to-one',
            target: 'LessonLearned',
            inverseSide: "individualLL",
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
    },
});
