const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class SummaryTask extends Base {
    // Define additional properties specific to Post entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.name = { type: 'varchar' };
        this.plannedStart = { type: 'date', nullable: true };
        this.plannedFinish = { type: 'date', nullable: true };
        this.actualStart = { type: 'date', nullable: true };
        this.actualFinish = { type: 'date', nullable: true };
        this.completion = { type: 'int', nullable: true };
        this.status = { type: 'boolean', nullable: true };
        this.baselineId = { type: 'uuid', nullable: true };
        this.milestoneId = { type: 'uuid', nullable: false };
        this.parentId = { type: 'uuid', nullable: true };

    }
}

module.exports = new EntitySchema({
    name: 'SummaryTask',
    tableName: 'summary_tasks',
    columns: new SummaryTask(),
    relations: {
        baseline: {
            type: 'many-to-one',
            target: 'baselines',
            inverseSide: 'SummaryTask',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        milestone: {
            type: 'many-to-one',
            target: 'milestones',
            //  inverseSide: 'SummaryTask',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        tasks: {
            type: 'one-to-many',
            target: 'Task',
            inverseSide: 'summarytask',
        },



    },
});
