import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import path from 'path';

const app: Express = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the frontend to access
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allowed headers
}));
app.use(express.json({ limit: '1gb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '1gb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import routes from './routes';
import meRoutes from './routes/me.routes';
import coSupervisorRoutes from './routes/co-supervisor.routes';
import dscMemberRoutes from './routes/dsc-member.routes';
import supervisorRoutes from './routes/supervisor.routes';
import studentRoutes from './routes/student.routes';
app.use('/api', routes);
app.use('/api/me', meRoutes);
app.use('/api/co-supervisor', coSupervisorRoutes);
app.use('/api/dsc-member', dscMemberRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/student', studentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('JISU-PHD Backend is running!');
});

// Error Handler
app.use(errorHandler);

export default app;
