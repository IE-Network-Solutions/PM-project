const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class OfficeMonthlyBudgetComment extends Base {
    // Define additional properties specific to budget comment entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.budgetComment = { type: 'text' };
        this.userId = { type: 'text', default: null };
    }
}

module.exports = new EntitySchema({
    name: 'OfficeMonthlyBudgetComment',
    tableName: 'office_monthly_budget_comments',
    columns: new OfficeMonthlyBudgetComment(),
    relations: {
        officeMonthlyBudget: {
            type: 'many-to-one',
            target: 'OfficeMonthlyBudget',
        },
    }
});
