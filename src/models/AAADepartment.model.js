
const { EntitySchema } = require("typeorm");

const AAADepartment = new EntitySchema({
    name: "AAADepartment",
    tableName: "AAA_Department",
    columns: {
        afterActionAnalysisId: {
            type: "uuid",
            primary: true,
        },
        departmentId: {
            type: "uuid",
            primary: true,
        }
    },
    relations: {
        afterActionAnalysis: {
            type: 'many-to-one',
            target: 'AfterActionAnalysis',
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },
        department: {
            type: 'many-to-one',
            target: 'Department',
            onDelete: "CASCADE",
            onUpdate: 'CASCADE'
        },
    },
});

module.exports = AAADepartment;
