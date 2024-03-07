const path = require('path');
const configs = require('./config');

// configuration file for TypeORM db connection

module.exports = {
  type: 'postgres',
  host: configs.postgres.host,
  port: configs.postgres.port,
  username: configs.postgres.userName,
  password: configs.postgres.pswd,
  database: configs.postgres.database,
  // ssl: { rejectUnauthorized: false },
  entities: [path.join(__dirname + '/../models/*.js')],
  // entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees, Risk, Issue, AfterActionAnalysis, RelatedIssue, Action, AfterActionAnalysisIssueRelated],
  // entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees],

  synchronize: configs.env == 'development' ? false : false,
  migrations: [path.join(__dirname, '/../migrations/*.js')], // Path to migration files

  cli: {
    entitiesDir: path.join(__dirname, '../models'),
    migrationsDir: path.join(__dirname, '../migrations*.js'),
  },
  extra: {
    connectionLimit: configs.postgres.maxConn, // Set the pool size to 20 connections (adjust as needed)
    idleTimeoutMillis: configs.postgres.idleTimeOut,
    connectionTimeoutMillis: configs.postgres.connTimeOut,
  },
};
