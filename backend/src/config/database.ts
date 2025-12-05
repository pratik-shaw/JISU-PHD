import mysql from 'mysql2/promise';
import config from './index';
import logger from '../utils/logger';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(connection => {
    logger.info('Successfully connected to the database.');
    connection.release();
  })
  .catch(error => {
    logger.error('Error connecting to the database: ', error);
  });


export default pool;
