// ============================================
// FILE: src/socket/socketHandler.ts
// ============================================

import { Server } from 'socket.io';
import { logger } from '../../utils/logger';
import { CustomSocket, handleDisconnect, handleJoinChat, handleJoinUser, handleLeaveChat, handleSendMessage, handleStopTyping, handleTyping } from './socketEvent';

export const socketHandler = (
  io: Server,
  socket: CustomSocket
): void => {
  logger.info(`🟢 New socket connection: ${socket.id}`);

  socket.on('join', (senderId: string) => {
    if (senderId) {
      handleJoinUser(io, socket, senderId);
    } else {
      logger.error('❌ Join event received without senderId');
    }
  });

  socket.on('join-chat', (data) => {
    handleJoinChat(socket, data);
  });

  socket.on('leave-chat', (data) => {
    handleLeaveChat(socket, data);
  });

  socket.on('send-message', (data) => {
    handleSendMessage(io, socket, data);
  });

  socket.on('typing', (data) => {
    handleTyping(socket, data);
  });

  socket.on('stop-typing', (data) => {
    handleStopTyping(socket, data);
  });

  socket.on('disconnect', () => {
    handleDisconnect(io, socket);
  });

  socket.on('error', (error) => {
    logger.error('❌ Socket error:', error);
  });
};
