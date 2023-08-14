const configs = require("./config");
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

// configuration file for TypeORM db connection

module.exports = {
    
  type: "postgres",
  host: configs.postgres.host,
  port: configs.postgres.port,
  username: configs.postgres.userName,
  password: configs.postgres.pswd,
  database: configs.postgres.database,
  // entities: [__dirname + "/../models/*.js"],
  entities: [Post,Project,Task,SubTask,Milestone,minuteOfMeeting,agenda,agendaTopic,momAction,momAttendees, ProjectMember],

  synchronize: configs.env == "development" ? true : false,
  migrations: [__dirname + "./migrations/*.js"], // Path to migration files
  cli: {
    entitiesDir: __dirname + "./models/*.js",
    migrationsDir: __dirname + "./migrations",
  },
  extra: {
    connectionLimit: configs.postgres.maxConn, // Set the pool size to 20 connections (adjust as needed)
    idleTimeoutMillis: configs.postgres.idleTimeOut,
    connectionTimeoutMillis: configs.postgres.connTimeOut,
  },
};