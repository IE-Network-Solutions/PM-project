const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Issue extends Base {
    // Define additional properties specific to Issue entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.riskDescription = { type: 'text' };
        this.causedBy = { type: 'varchar' };
        this.consequences = { type: 'varchar' };
        this.riskOwner = { type: 'varchar' };
        this.status = { type: 'varchar' };
        this.impact = { type: 'varchar' };
        this.control = { type: 'varchar' };
        this.controlOwner = { type: 'varchar' };
        this.residualImpact = { type: 'varchar' };
    }
}

module.exports = new EntitySchema({
    name: 'Issue',
    tableName: 'issues',
    columns: new Issue(),
});
