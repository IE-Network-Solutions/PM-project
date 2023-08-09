const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class momAttendees extends Base {
  // Define additional properties specific to Milestone entity
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
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
        target: "minute_of_meetings", // Target entity name (name of the related entity)
        inverseSide: "mom_attendees", // Property name on the related entity that points back to Post
      },   
  },
});
