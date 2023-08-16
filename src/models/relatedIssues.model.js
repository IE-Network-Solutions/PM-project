const { EntitySchema, OneToMany } = require('typeorm');
const { Base } = require('./BaseModel')


class RelatedIssue extends Base {
    // Define additional properties specific to AAA entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.name = { type: 'varchar' };
    }
}
module.exports = new EntitySchema({
    name: 'RelatedIssue',
    tableName: 'relatedissues',
    columns: new RelatedIssue(),
    relations: {
        afterActionAnalysis_issueRelated: {
            type: 'one-to-many',
            target: 'AfterActionAnalysis_IssueRelated',
            inverseSide: 'afterActionAnalysis',
        },
    },
});
