

const { EntitySchema } = require('typeorm');



class Department {
    // Define additional properties specific to Department entity
    constructor() {
        this.id = { primary: true, type: 'uuid', generated: 'uuid' };
        this.departmentName = { type: 'varchar' };
        this.abbrivation = { type: 'varchar' };
        this.departmentProductManager = { type: 'uuid', nullable: true };
        this.idDeleted = { type: 'boolean' };
        this.createdBy = { type: 'varchar', nullable: true };
        this.updatedBy = { type: 'varchar', nullable: true };
        this.createdAt = { type: 'timestamp', nullable: true };
        this.updatedAt = { type: 'timestamp', nullable: true };
    }
}

module.exports = new EntitySchema({
    name: 'Department',
    tableName: 'department',
    columns: new Department(),
    relations: {
        AAA_Department: {
            type: "many-to-many",
            target: "AfterActionAnalysis",
            joinTable: {
                name: "AAA_Department",
                joinColumn: { name: "departmentId", referencedColumnName: "id" },
                inverseJoinColumn: {
                    name: "afterActionAnalysisId",
                    referencedColumnName: "id",
                },
            },
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },
    }
});
