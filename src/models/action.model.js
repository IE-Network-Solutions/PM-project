const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Action extends Base {
    constructor() {
        super();
        this.action = { type: 'varchar' };
        this.responsiblePersonId = { type: 'varchar', nullable: true };
        this.authorizedPersonId = { type: 'varchar', nullable: true };
        this.afterActionAnalysisId = { type: 'varchar', nullable: true }
    }
}

module.exports = new EntitySchema({
    name: 'Action',
    tableName: 'actions',
    columns: new Action(),
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
        authorizedPerson: {
            type: 'many-to-one',
            target: 'User',
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },
    },
});
