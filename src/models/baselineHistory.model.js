const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');


class BaselineHistory extends Base {
    constructor() {
        super();
        this.baselineData = { type: 'json' };

        this.projectId = { type: 'uuid' };
    }
}

module.exports = new EntitySchema({
    name: 'BaselineHistory',
    tableName: 'baseline_history',
    columns: new BaselineHistory(),
    relations: {
        project: {
            type: 'many-to-one',
            target: 'Project',
            inverseSide: 'baslineHistory',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    }
});
