// const { EntitySchema } = require('typeorm');
// const {Base} = require('./BaseModel')


// class momAttendees extends Base {
//   constructor() {
//     super();
//     this.attendeeId = { type: 'varchar'};
//     this.momId = { type: 'varchar'};
//   }
// }

// module.exports = new EntitySchema({
//   name: 'MomAttendees',
//   tableName: 'mom_attendees',
//   columns: new momAttendees(),

//   relations: {
//     // mom: {
//     //     type: "many-to-one", 
//     //     target: "minute_of_meetings",
//     //     inverseSide: "mom_attendees",
//     //   },  
//       projectMembers: {
//         type: "many-to-many",
//         target: "User",
//         joinTable: {
//           name: "project_member",
//           joinColumn: { name: "projectId", referencedColumnName: "id" },
//           inverseJoinColumn: {
//             name: "userId",
//             referencedColumnName: "id",
//           },
//         },
//         onDelete: "SET NULL",
//         onUpdate: "CASCADE",
//       }, 
//   },
// });


const { EntitySchema } = require("typeorm");

const momAttendees = new EntitySchema({
  name: "momAttendees",
  columns: {
    userId: {
      type: "uuid",
      primary: true,
    },
    momId: {
      type: "uuid",
      primary: true,
    },
    department: {
      type: "varchar",
      nullable: true
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
    },
    mom: {
      type: 'many-to-one',
      target: 'minuteOfMeeting',
      onDelete: 'CASCADE',
    },
  },
});

module.exports = momAttendees;
