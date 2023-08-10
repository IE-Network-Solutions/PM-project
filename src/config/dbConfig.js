const configs = require("./config");
const Post = require("../models/post.model.js")
const Risk = require('../models/risk.model.js');
const { Issue, AfterActionAnalysis, RelatedIssue, Action, AfterActionAnalysisAction } = require("../models");

module.exports = {

  type: "postgres",
  host: configs.postgres.host,
  port: configs.postgres.port,
  username: configs.postgres.userName,
  password: configs.postgres.pswd,
  database: configs.postgres.database,
  // entities: [__dirname + "/../models/*.js"],
  entities: [Post, Risk, Issue, AfterActionAnalysis, RelatedIssue, Action, AfterActionAnalysisAction],

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