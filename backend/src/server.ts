import app from './app';
import config from './config';
import logger from './utils/logger';
import './config/database';

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});

process.on('unhandledRejection', (reason: Error | any) => {
  logger.error(`Unhandled Rejection: ${reason.message || reason}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});
