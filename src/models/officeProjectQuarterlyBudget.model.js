const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');


class OfficeQuarterlyBudget extends Base {
    // Define additional properties specific to Budget entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.budgetsData = { type: 'json' };
        this.from = { type: 'date' };
        this.to = { type: 'date' };
        this.approvalStageId = { type: 'varchar', nullable: true }
        this.approved = { type: 'boolean', default: false };
        this.rejected = { type: 'boolean', default: false };
        this.isDeleted = { type: 'boolean', default: false };
        this.projectId = { type: 'uuid', nullable: true };


    }
}

module.exports = new EntitySchema({
    name: 'OfficeQuarterlyBudget',
    tableName: 'office_quarterly_budgets',
    columns: new OfficeQuarterlyBudget(),
    relations: {

        approvalStage: {
            type: 'many-to-one',
            target: 'ApprovalStage',
        },
        officeQuarterlyBudgetComment: {
            type: 'one-to-many',
            target: 'OfficeQuarterlyBudgetComment',
            inverseSide: 'OfficeQuarterlyBudget'
        },
        project: {
            type: 'many-to-one',
            target: 'Project',
            inverseSide: 'OfficeQuarterlyBudget',
            onDelete: 'CASCADE',

        },

    }
});
