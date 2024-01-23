const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');


class OfficeMonthlyBudget extends Base {
    // Define additional properties specific to Budget entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.budgetAmount = { type: 'float', nullable: true };
        this.from = { type: 'date' };
        this.to = { type: 'date' };
        this.budgetCategoryId = { type: 'varchar' };
        this.currencyId = { type: 'varchar' };
        this.projectId = { type: 'varchar' };
        this.isDeleted = { type: 'boolean', default: false }

    }
}

module.exports = new EntitySchema({
    name: 'OfficeMonthlyBudget',
    tableName: 'office_monthly_budgets',
    columns: new OfficeMonthlyBudget(),
    relations: {
        budgetCategory: {
            type: 'many-to-one',
            target: 'budgetCategory',
        },
        currency: {
            type: 'many-to-one',
            target: 'Currency',
        },
        project: {
            type: 'many-to-one',
            target: 'Project',
        },

    }
});
