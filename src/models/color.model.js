const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Color extends Base {
    constructor() {
        super();
        this.name = { type: 'varchar', nullable: true };
        this.code = { type: 'varchar', nullable: true };
    }
}
module.exports = new EntitySchema({
    name: 'Color',
    tableName: 'Color',
    columns: new Color(),
});