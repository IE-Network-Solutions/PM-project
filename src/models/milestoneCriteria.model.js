const { EntitySchema } = require('typeorm');

class MilestoneCriteria {
    constructor() {
        this.milestoneId = { type: 'uuid', primary: true };
        this.criteriaId = { type: 'uuid', primary: true }
    }
}

module.exports = new EntitySchema({
    name: "MilestoneCriteria",
    tableName: "milestone_criteria",
    columns: new MilestoneCriteria(),
    relations: {
        milestone: {
            type: "many-to-one",
            target: "Milestone",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
        criteria: {
            type: "many-to-one",
            target: "Criteria",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        }
    }
})
