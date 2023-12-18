const { EntitySchema } = require('typeorm');
const { Base } = require('./BaseModel')


class weeklyReport extends Base {
  constructor() {
    super();
    this.year = { type: 'int' }
    this.month = { type: 'int' }
    this.week = { type: 'int' }
    this.sleepingTasks = { type: 'json', nullable: true };
    this.nextWeekTasks = { type: 'json', nullable: true };
    this.risks = { type: 'json', nullable: true };
    this.issues = { type: 'json', nullable: true };
    this.overAllProgress = { type: 'json', nullable: true };
    this.isApproved = { type: 'boolean', default: false };
    this.projectId = { type: 'uuid', };
  }
}

module.exports = new EntitySchema({
  name: 'WeeklyReport',
  columns: new weeklyReport(),
  relations: {
    project: {
      type: "many-to-one",
      target: "Project",
      inverseSide: "weeklyReport",
    },
    weeklyReportComment: {
      type: "one-to-many",
      target: "WeeklyReportComment",
      inverseSide: "weeklyReport",
    },
  },
});
