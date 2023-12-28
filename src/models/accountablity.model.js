const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Accountablity extends Base {
    constructor() {
        super();
        this.description = { type: 'varchar' };
        this.responsiblePersonId = { type: 'varchar', nullable: true };
        this.afterActionAnalysisId = { type: 'varchar', nullable: true };

    }
}

module.exports = new EntitySchema({
    name: 'Accountablity',
    tableName: 'accountablities',
    columns: new Accountablity(),
    relations: {
        afterActionAnalysis: {
            type: 'many-to-one',
            target: 'AfterActionAnalysis',
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
        responsiblePerson: {
            type: 'many-to-one',
            target: 'User',
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },

    },
});
