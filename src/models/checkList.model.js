const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class CheckList extends Base {
    constructor() {
        super();
        this.name = { type: 'varchar' };
        this.milestoneId = { type: 'varchar' };
        this.solutionId = { type: 'varchar' };
    }
}

module.exports = new EntitySchema({
    name: 'CheckList',
    tableName: 'CheckList',
    columns: new CheckList(),

    relations: {
        milestone: {
            type: 'many-to-one',
            target: "Milestone",
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        solution: {
            type: 'many-to-one',
            target: "Solution",
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    }
});
