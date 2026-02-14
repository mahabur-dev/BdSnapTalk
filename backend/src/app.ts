import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundError from './app/error/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes/routes';
import http from 'http';
const app = express();

//setup socket instance
const serverInstance = http.createServer(app);

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { initializeSocket } from './app/modules/socket/setupSocket';


// Application routes (Centralized router)
app.use('/api', router);


// Root router
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the server' });
});

const ioInstance = initializeSocket(serverInstance);
app.set('io', ioInstance);

// Not found route
app.use(notFoundError);

// Global error handler
app.use(globalErrorHandler);


export const server = serverInstance;
export const io = ioInstance;
export default app;
