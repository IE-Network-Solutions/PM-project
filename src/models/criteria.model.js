const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Criteria extends Base {
    constructor() {
        super();
        this.name = { type: 'varchar', nullable: true };
        this.description = { type: 'varchar', nullable: true };
    }
}
module.exports = new EntitySchema({
    name: 'Criteria',
    tableName: 'Criteria',
    columns: new Criteria(),
    relations: {
        todo: {
            type: "one-to-many",
            target: "Todo",
            inverseSide: "criteria"
        },
        milestone: {
            type: 'many-to-many',
            target: 'Milestone',
            joinTable: {
                name: 'milestone_criteria',
                joinColumn: { name: 'criteriaId', referencedColumnName: 'id' },
                inverseJoinColumn: { name: 'milestoneId', referencedColumnName: 'id' },
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    }
});
