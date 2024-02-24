const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')


class momAction extends Base {
  constructor() {
    super();
    this.action = { type: 'varchar', nullable: true };
    // this.responsiblePersonId = { type: 'uuid', nullable: true };
    this.deadline = { type: 'varchar', nullable: true };
    this.momId = { type: 'uuid', nullable: true };
  }
}

module.exports = new EntitySchema({
  name: 'momAction',
  tableName: 'mom_actions',
  columns: new momAction(),

  relations: {
    mom: {
      type: "many-to-one",
      target: "minute_of_meetings",
      inverseSide: "mom_actions",
    },
    momActionResponsible: {
      type: "one-to-many",
      target: "MomActionResponsible",
      inverseSide: "momAction",
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
});
