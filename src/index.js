const app = require('./app');
const rabbitConsumer = require('./utils/consumer');

const AppDataSource = require('./utils/createDatabaseConnection');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

rabbitConsumer(['user.*','project_budget.*','role.*']).catch((error) => {
  console.error('Error consuming messages:', error);
});

AppDataSource.initialize()
  .then(() => {
    logger.info('Connected to Postgres through Typeorm');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port http://localhost:${config.port}`);
    });
  })
  .catch((e) => {
    logger.error(`Exception Error ${e}`);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
