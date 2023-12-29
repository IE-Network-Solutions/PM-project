const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel');

class Todo extends Base {
    constructor() {
        super();
        this.name = { type: 'varchar', nullable: true };
        this.criteriaId = { type: 'varchar', nullable: true };
    }
}
module.exports = new EntitySchema({
    name: 'Todo',
    tableName: 'Todo',
    columns: new Todo(),
    relations: {
        criteria: {
            type: 'many-to-one',
            target: "Criteria",
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        evalution: {
            type: "many-to-many",
            target: "Evalution",
            joinTable: {
                name: "todo_evalution",
                joinColumn: { name: "todoId", referencedColumnName: "id" },
                inverseJoinColumn: { name: "evalutionId", referencedColumnName: "id" }
            },
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
            color: {
                target: "Color",
                type: "one-to-many",
                inverseSide: "color"
            }
    }
});
