const { EntitySchema } = require('typeorm');
class TodoEvalution {
    constructor() {
        this.evalutionId = { type: "uuid", primary: true };
        this.todoId = { type: "uuid", primary: true };
        this.colorId = { type: "uuid", nullable: true };
    }
}
module.exports = new EntitySchema({
    name: "TodoEvalution",
    tableName: "todo_evalution",
    columns: new TodoEvalution(),
    relations: {
        evalution: {
            type: "many-to-one",
            target: "Evalution",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
        todo: {
            type: "many-to-one",
            target: "Todo",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
        color: {
            type: "many-to-one",
            target: "Color",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        }
    },
});