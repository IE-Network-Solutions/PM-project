const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Action extends Base {
    constructor() {
        super();
        this.responsiblePersonId = { type: 'varchar', nullable: true };
        this.authorizedPersonId = { type: 'varchar', nullable: true };
        this.responsiblePersonName = { type: 'varchar', nullable: true };
        this.authorizedPersonName = { type: 'varchar', nullable: true };
        this.action = { type: 'varchar' };
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
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },
    },
});
