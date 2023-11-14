const configs = require('./config');

// configuration file for TypeORM db connection

module.exports = {
  type: 'postgres',
  host: configs.postgres.host,
  port: configs.postgres.port,
  username: configs.postgres.userName,
  password: configs.postgres.pswd,
  database: configs.postgres.database,
  // ssl:{rejectUnautorized:false},
  entities: [__dirname + '/../models/*.js'],
  // entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees, Risk, Issue, AfterActionAnalysis, RelatedIssue, Action, AfterActionAnalysisIssueRelated],
  // entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees],

  synchronize: configs.env == 'development' ? true : false,
  migrations: [__dirname + './migrations/*.js'], // Path to migration files
  cli: {
    entitiesDir: __dirname + '/../models/*.js',
    migrationsDir: __dirname + './migrations',
  },
  extra: {
    connectionLimit: configs.postgres.maxConn, // Set the pool size to 20 connections (adjust as needed)
    idleTimeoutMillis: configs.postgres.idleTimeOut,
    connectionTimeoutMillis: configs.postgres.connTimeOut,
  },
};
