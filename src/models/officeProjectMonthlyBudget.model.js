const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');


class OfficeMonthlyBudget extends Base {
    // Define additional properties specific to Budget entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.budgetsData = { type: 'json' };
        this.from = { type: 'date' };
        this.to = { type: 'date' };
        this.approved = { type: 'boolean', default: false };
        this.rejected = { type: 'boolean', default: false };
    }
}

module.exports = new EntitySchema({
    name: 'OfficeMonthlyBudget',
    tableName: 'office_monthly_budgets',
    columns: new OfficeMonthlyBudget(),
    relations: {
        approvalStage: {
            type: 'many-to-one',
            target: 'ApprovalStage',
        },
        officeMonthlyBudgetcomments: {
            type: 'one-to-many',
            target: 'OfficeMonthlyBudgetComment',
            inverseSide: 'officeMonthlyBudget'
        },
    }
});
