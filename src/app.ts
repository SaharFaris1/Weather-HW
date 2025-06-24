import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import cookieParser from 'cookie-parser';
import { dev, port } from './utils/helpers';
import authRoutes from './routes/auth.route';
import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';
import { connectDB, deleteAllCollections } from './config/db';
import { AppError } from './utils/error';
import historyRoutes from './routes/history.route';
import weatherRoutes from './routes/weather.route';


// Load environment variables
dotenv.config();
connectDB()
const app: Express = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000', 
  'https://weather-1-43o2.onrender.com' 
];



// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(helmet());
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/weather', weatherRoutes);



// Basic route
app.get('/', (req: Request, res: Response) => {
  res
    .status(OK)
    .json({ message: 'List & Items API - Welcome!' });
});

// Basic error handling middleware
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(dev && { stack: err.stack })
    });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    status: 'error', 
    message: 'Something went wrong!',
    ...(dev && { error: err.message, stack: err.stack })
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
