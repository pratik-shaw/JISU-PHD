import dotenv from 'dotenv';
import { parseTimeStringToSeconds } from '../utils/time.util';

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 3001,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: parseTimeStringToSeconds(process.env.JWT_EXPIRES_IN || '1h'),
  },
};

export default config;
