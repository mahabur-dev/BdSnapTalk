// // ============================================
// // FILE: src/config/socket.js
// // ============================================

import { Server } from 'socket.io';
import { logger } from '../../utils/logger';
import { socketHandler } from './socketHandler';
// import { socketHandler } from '../socket/socketHandler.js';

export const initializeSocket = (serverInstance:any) => {
  const io = new Server(serverInstance, {
    pingTimeout: 60000,
    pingInterval: 25000,
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 50 * 1024 * 1024,
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    logger.info(`🟢 User connected: ${socket.id}`);
    socketHandler(io, socket);
  });

  return io;
};
