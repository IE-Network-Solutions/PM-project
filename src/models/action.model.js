const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Action extends Base {
    // Define additional properties specific to Action entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.responsiblePersonName = { type: 'varchar' };
        this.responsiblePersonId = { type: 'varchar' };
        this.authorizedPersonName = { type: 'varchar' };
        this.authorizedPersonId = { type: 'varchar' };
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
