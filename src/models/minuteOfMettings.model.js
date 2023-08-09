const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class minuteOfMeeting extends Base {
  constructor() {
    super(); // Call the constructor of the Base entity to inherit its properties
    this.title = { type: 'varchar' };
    this.meeting_date = { type: 'date', nullable: true };
    this.meeting_time = { type: 'varchar', nullable: true};
    this.location = { type: 'varchar', nullable: true};
    this.facilitator = { type: 'varchar', nullable: true};
    this.objective = { type: 'varchar', nullable: true};
    this.special_note = { type: 'varchar', nullable: true};
  }
}

module.exports = new EntitySchema({
  name: 'minuteOfMeeting',
  tableName: 'minute_of_meetings',
  columns: new minuteOfMeeting(),
  relations: {
    project: {
        type: "many-to-one", 
        target: "projects", // Target entity name (name of the related entity)
        inverseSide: "minute_of_meetings", // Property name on the related entity that points back to Agenda
      },   
  },
});
