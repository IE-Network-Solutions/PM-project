const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')


class AgendaTopic extends Base {
  constructor() {
    super();
    this.agendaPoints = { type: 'varchar' };
    this.userId = { type: 'uuid', nullable: true };
    this.otherUser = { type: 'varchar', nullable: true }
    this.agendaId = { type: 'uuid' };
  }
}

module.exports = new EntitySchema({
  name: 'MomAgendaTopic',
  columns: new AgendaTopic(),

  relations: {
    agenda: {
      type: "many-to-one",
      target: "MomAgenda",
      inverseSide: "momTopics",
      onDelete: 'CASCADE',
    },
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "agenda",
    },
  },
});
