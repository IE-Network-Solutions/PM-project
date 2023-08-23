const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Action extends Base {
    constructor() {
        super(); 
        this.responsiblePersonId = { type: 'varchar' };
        // this.authorizedPersonId = { type: 'varchar' };
        this.action = { type: 'varchar' };
        this.afterActionAnalysisId = { type: 'varchar', nullable: true }
    }
}

module.exports = new EntitySchema({
    name: 'Action',
    tableName: 'mom_actions',
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
