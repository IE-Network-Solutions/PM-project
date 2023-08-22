const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')



class Action extends Base {
    constructor() {
        super(); 
        this.responsiblePersonId = { type: 'varchar' };
        // this.authorizedPersonId = { type: 'varchar' };
        this.action = { type: 'varchar' };
    }
}

module.exports = new EntitySchema({
    name: 'Action',
    tableName: 'mom_actions',
    columns: new Action(),
    // relations: {
    //     afterActionAnalysis: {
    //         type: 'many-to-one',
    //         target: 'AfterActionAnalysis',
    //         joinColumn: {
    //             name: "AAAId",
    //             referencedColumnName: "id"
    //         },
    //         onDelete: "CASCADE",
    //         onUpdate: 'CASCADE'
    //     },
    // },
});
