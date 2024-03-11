const { EntitySchema } = require('typeorm');

class Quality {
    constructor() {
        this.id = { primary: true, type: 'uuid' };
        this.projectId = { type: 'varchar', nullable: true };
        this.projectManagerId = { type: 'varchar', nullable: true };
        this.fieldEngineerId = { type: 'varchar', nullable: true };
        this.checkListId = { type: 'varchar', nullable: true };
        this.resultId = { type: 'varchar', nullable: true };
        this.comment = { type: 'text', nullable: true };
    }
}
module.exports = new EntitySchema({
    name: 'Quality',
    tableName: 'Quality',
    columns: new Quality(),
    relations: {
        project: {
            type: 'many-to-one',
            target: 'Project',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        projectManager: {
            type: 'many-to-one',
            target: 'User',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        fieldEngineer: {
            type: 'many-to-one',
            target: 'User',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        checkList: {
            type: 'many-to-one',
            target: 'CheckList',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        result: {
            type: 'many-to-one',
            target: 'CheckList',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    }
});
