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
        this.isDeleted = { type: 'boolean', default: false }


    }
}

module.exports = new EntitySchema({
    name: 'OfficeQuarterlyBudget',
    tableName: 'office_quarterly_budgets',
    columns: new OfficeQuarterlyBudget(),
    relations: {
        // budgetCategory: {
        //     type: 'many-to-one',
        //     target: 'budgetCategory',
        // },
        // currency: {
        //     type: 'many-to-one',
        //     target: 'Currency',
        // },
        // project: {
        //     type: 'many-to-one',
        //     target: 'Project',
        // },


        approvalStage: {
            type: 'many-to-one',
            target: 'ApprovalStage',
        },
        officeQuarterlyBudgetComment: {
            type: 'one-to-many',
            target: 'OfficeQuarterlyBudgetComment',
            inverseSide: 'OfficeQuarterlyBudget'
        },

    }
});
