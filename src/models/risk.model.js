const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Risk extends Base {
    // Define additional properties specific to Risk entity
    constructor() {
        super(); // Call the constructor of the Base entity to inherit its properties
        this.riskDescription = { type: 'text' };
        this.causedBy = { type: 'varchar' };
        this.consequences = { type: 'varchar' };
        this.riskOwner = { type: 'varchar' };
        this.status = { type: 'varchar' };
        this.controlOwner = { type: 'varchar' };
        this.control = { type: 'varchar' };
        this.probability = { type: 'varchar' };
        this.impact = { type: 'varchar' };
        this.riskRate = { type: 'varchar' };
        this.residualProbability = { type: 'varchar' };
        this.residualImpact = { type: 'varchar' };
        this.residualRiskRate = { type: 'varchar' };
        this.projectId = { type: 'varchar', nullable: true };
    }
}

module.exports = new EntitySchema({
    name: 'Risk',
    tableName: 'risks',
    columns: new Risk(),
    relations: {
        project: {
            type: 'many-to-one',
            target: 'Project',
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
    }

});
