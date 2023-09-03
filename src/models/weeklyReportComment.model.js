const { EntitySchema } = require('typeorm');
const {Base} = require('./BaseModel')


class WeeklyReportComment extends Base {
  constructor() {
    super(); 
    this.comment = { type: 'varchar' };
    this.weeklyReportId = { type: 'uuid'};
    this.userId = { type: 'uuid'};
  }
}

module.exports = new EntitySchema({
  name: 'WeeklyReportComment',
  columns: new WeeklyReportComment(),
  relations: {
    weeklyReport: {
        type: "many-to-one", 
        target: "WeeklyReport", 
        inverseSide: "weeklyReportComment",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },   
      user: {
        type: "many-to-one", 
        target: "User", 
        inverseSide: "reportComment",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },      
  },
});
