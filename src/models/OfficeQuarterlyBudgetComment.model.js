const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class OfficeQuarterlyBudgetComment extends Base {
    // Define additional properties specific to budget comment entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.budgetComment = { type: 'text' };
        this.userId = { type: 'text', default: null };
    }
}

module.exports = new EntitySchema({
    name: 'OfficeQuarterlyBudgetComment',
    tableName: 'office_qarterly_budget_comments',
    columns: new OfficeQuarterlyBudgetComment(),
    relations: {
        OfficeQuarterlyBudget: {
            type: 'many-to-one',
            target: 'OfficeQuarterlyBudget',
        },
    }
});