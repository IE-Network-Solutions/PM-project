const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class momAttendees extends Base {
  constructor() {
    super();
    this.attendeeId = { type: 'varchar', nullable: true };
    this.attendeeName = { type: 'varchar', nullable: true };
    this.email = { type: 'varchar', nullable: true};
    this.signature = { type: 'varchar', nullable: true};
  }
}

module.exports = new EntitySchema({
  name: 'MomAttendees',
  tableName: 'mom_attendees',
  columns: new momAttendees(),
  
  relations: {
    mom: {
        type: "many-to-one", 
        target: "minute_of_meetings",
        inverseSide: "mom_attendees",
      },   
  },
});
