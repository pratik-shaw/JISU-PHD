import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the frontend to access
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allowed headers
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
import routes from './routes';
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('JISU-PHD Backend is running!');
});

// Error Handler
app.use(errorHandler);

export default app;
