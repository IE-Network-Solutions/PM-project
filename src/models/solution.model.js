const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Solution extends Base {
    constructor() {
        super();
        this.name = { type: 'varchar', nullable: true };
    }
}
module.exports = new EntitySchema({
    name: 'Solution',
    tableName: 'Solution',
    columns: new Solution(),
});
