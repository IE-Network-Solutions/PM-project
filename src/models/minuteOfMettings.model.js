const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class minuteOfMeeting extends Base {
  constructor() {
    super(); 
    this.title = { type: 'varchar' };
    this.meetingDate = { type: 'date', nullable: true };
    this.meetingTime = { type: 'varchar', nullable: true};
    this.location = { type: 'varchar', nullable: true};
    this.facilitatorId = { type: 'uuid', nullable: true};
    this.objective = { type: 'varchar', nullable: true};
    this.specialNote = { type: 'varchar', nullable: true};
    this.externalAttendees = {type: 'json', nullable: true}
    this.projectId = {type: 'uuid'}
  }
}

module.exports = new EntitySchema({
  name: 'minuteOfMeeting',
  tableName: 'minute_of_meetings',
  columns: new minuteOfMeeting(),
  
  relations: {
    project: {
        type: "many-to-one", 
        target: "projects", 
        inverseSide: "minute_of_meetings", 
      }, 

      momAgenda: {
        type: "one-to-many", 
        target: "MomAgenda", 
        inverseSide: "mom", 
      },   
      facilitator: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "momFacilitator", 
      },   
      momAttendees: {
        type: "many-to-many",
        target: "User",
        joinTable: {
          name: "mom_attendees",
          joinColumn: { name: "momId", referencedColumnName: "id" },
          inverseJoinColumn: {
            name: "userId",
            referencedColumnName: "id",
          },
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      agenda: {
        type: "one-to-many", 
        target: "MomAgenda", 
        inverseSide: "mom", 
      }, 
      momAction:{
        type: "one-to-many",
        target: "momAction",
        inverseSide: "mom"
      },
      momComment: {
        type: "one-to-many", 
        target: "MomComment", 
        inverseSide: "mom", 
      },   
  },
});
