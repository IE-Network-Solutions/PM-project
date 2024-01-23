const { EntitySchema, JoinColumn } = require('typeorm');
const { Base } = require('./BaseModel');

class Evalution extends Base {
    constructor() {
        super();
        this.checkListId = { type: 'uuid' };
    }
}
module.exports = new EntitySchema({
    name: "Evalution",
    tableName: "Evalution",
    columns: new Evalution(),
    relations: {
        checkList: {
            type: "many-to-one",
            target: "CheckList",
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        },
        todo: {
            type: "many-to-many",
            target: "Todo",
            joinTable: {
                name: "todo_evalution",
                joinColumn: { name: "evalutionId", referencedColumnName: "id" },
                inverseJoinColumn: { name: "todoId", referencedColumnName: "id" }
            },
            onDelete: "SET NULL",
            onUpdate: 'CASCADE'
        }
    }
})