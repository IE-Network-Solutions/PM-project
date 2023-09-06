const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');



class AfterActionAnalysis extends Base {
    // Define additional properties specific to AAA entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.title = { type: 'varchar' };
        this.description = { type: 'text' };
        this.teamInvolves = { type: 'varchar', nullable: true };
        this.rootCause = { type: 'text' };
        this.lessonLearned = { type: 'text' };
        this.remarks = { type: 'text' };
        this.projectId = { type: "varchar", nullable: true };
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
        project: {
            type: 'many-to-one',
            target: 'Project',
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },
        department: {
            type: "many-to-many",
            target: "Department",
            joinTable: {
                name: "AAA_Department",
                joinColumn: { name: "afterActionAnalysisId", referencedColumnName: "id" },
                inverseJoinColumn: { name: "departmentId", referencedColumnName: "id" },
            },
        },
    },
});
