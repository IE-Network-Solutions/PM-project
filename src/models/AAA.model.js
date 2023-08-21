const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');



class AfterActionAnalysis extends Base {
    // Define additional properties specific to AAA entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.title = { type: 'varchar' };
        this.description = { type: 'text' };
        this.teamInvolves = { type: 'varchar' };
        this.rootCause = { type: 'text' };
        this.lessonLearned = { type: 'text' };
        this.remarks = { type: 'text' };
    }
}

module.exports = new EntitySchema({
    name: 'AfterActionAnalysis',
    tableName: 'afterActionAnalysis',
    columns: new AfterActionAnalysis(),
    relations: {
        actions: {
            type: 'one-to-many',
            target: 'Action',
            inverseSide: 'afterActionAnalysis',
        },
        issueRelates: {
            type: 'one-to-many',
            target: 'RelatedIssue',
            inverseSide: 'afterActionAnalysis',
        },
    },
});
