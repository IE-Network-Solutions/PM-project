const { EntitySchema, ManyToOne, PrimaryGeneratedColumn } = require('typeorm');
const { Base } = require('./BaseModel');

class AfterActionAnalysis_IssueRelated extends Base {
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
    }
}

module.exports = new EntitySchema({
    name: 'AfterActionAnalysis_IssueRelated',
    tableName: 'after_action_analysis_issue_related',
    columns: new AfterActionAnalysis_IssueRelated(),
    relations: {
        afterActionAnalysis: {
            type: 'many-to-one',
            target: 'AfterActionAnalysis',
            joinColumn: {
                name: 'afterActionAnalysisId',
                referencedColumnName: 'id',
            },
        },
        issueRelated: {
            type: 'many-to-one',
            target: 'RelatedIssue',
            joinColumn: {
                name: 'relatedIssueId',
                referencedColumnName: 'id',
            },
        },
    },
});