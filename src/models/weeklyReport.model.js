const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class weeklyReport extends Base {
  constructor() {
    super(); 
    this.sleepingTasks = { type: 'json' };
    this.nextWeekTasks = { type: 'json', };
    this.risks = { type: 'json', };
    this.issues = { type: 'json', };
    this.isApproved = { type: 'boolean', };
    this.projectId = { type: 'uuid', };
  }
}

module.exports = new EntitySchema({
  name: 'WeeklyReport',
  columns: new weeklyReport(),
  relations: {
    project: {
        type: "many-to-one", 
        target: "projects",
        inverseSide: "milestones",
    },   
  },
});
