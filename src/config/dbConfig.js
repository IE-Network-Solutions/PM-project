const configs = require("./config");
<<<<<<< HEAD
const Post= require("../models/post.model.js")
const Project= require("../models/project.model")
const Task= require("../models/task.model")
const SubTask= require("../models/subtask.model")
const Milestone= require("../models/milestone.model")
const minuteOfMeeting= require("../models/minuteOfMettings.model")
const agenda= require("../models/agenda.model")
const agendaTopic= require("../models/agendaTopics.model")
const momAction= require("../models/momActions.model")
const momAttendees= require("../models/momAttendees.model")
const ProjectMember= require("../models/project_member.model")
const ProjectContractValue= require("../models/projectContractValue.model")
=======
>>>>>>> ac7021c5486cff6b5d51b85812ba77c8369d0b34

// configuration file for TypeORM db connection

module.exports = {

  type: "postgres",
  host: configs.postgres.host,
  port: configs.postgres.port,
  username: configs.postgres.userName,
  password: configs.postgres.pswd,
  database: configs.postgres.database,
<<<<<<< HEAD
  // entities: [__dirname + "/../models/*.js"],
  entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees, ProjectMember,ProjectContractValue],
=======
  entities: [__dirname + "/../models/*.js"],
  // entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees, Risk, Issue, AfterActionAnalysis, RelatedIssue, Action, AfterActionAnalysisIssueRelated],
  // entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees],
>>>>>>> ac7021c5486cff6b5d51b85812ba77c8369d0b34

  synchronize: configs.env == "development" ? true : false,
  migrations: [__dirname + "./migrations/*.js"], // Path to migration files
  cli: {
    entitiesDir: __dirname + "/../models/*.js",
    migrationsDir: __dirname + "./migrations",
  },
  extra: {
    connectionLimit: configs.postgres.maxConn, // Set the pool size to 20 connections (adjust as needed)
    idleTimeoutMillis: configs.postgres.idleTimeOut,
    connectionTimeoutMillis: configs.postgres.connTimeOut,
  },
};