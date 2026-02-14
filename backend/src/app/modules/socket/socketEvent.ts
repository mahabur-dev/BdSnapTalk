// ============================================
// FILE: src/socket/socketEvents.ts
// ============================================

import { Server, Socket } from 'socket.io';
import { logger } from '../../utils/logger';

// 🔹 Extend Socket to store userId
export interface CustomSocket extends Socket {
  userId?: string;
}

// 🔹 Payload interfaces
interface JoinChatPayload {
  senderId: string;
  receiverId: string;
}

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  message: any; // you can replace `any` with IMessage later
}

interface TypingPayload {
  senderId: string;
  receiverId: string;
}

// 🔹 Track online users (userId -> socketId)
const onlineUsers: Map<string, string> = new Map();

export const handleJoinUser = (
  io: Server,
  socket: CustomSocket,
  senderId: string
): void => {
  socket.join(`user:${senderId}`);

  onlineUsers.set(senderId, socket.id);
  socket.userId = senderId;

  io.emit('user-online', { userId: senderId });

  socket.emit('connected');
  logger.info(`👤 User ${senderId} joined personal room: user:${senderId}`);
};

export const handleJoinChat = (
  socket: CustomSocket,
  data: JoinChatPayload
): void => {
  const { senderId, receiverId } = data;

  if (!senderId || !receiverId) {
    logger.error('❌ Missing senderId or receiverId in join-chat');
    return;
  }

  const chatRoomId = [senderId, receiverId].sort().join('-');
  socket.join(`chat:${chatRoomId}`);

  const isReceiverOnline = onlineUsers.has(receiverId);

  socket.emit('joined-chat', {
    chatRoomId: `chat:${chatRoomId}`,
    receiverOnline: isReceiverOnline,
  });
};

export const handleSendMessage = (
  io: Server,
  socket: CustomSocket,
  data: SendMessagePayload
): void => {
  try {
    const { senderId, receiverId, message } = data;

    if (!senderId || !receiverId || !message) {
      socket.emit('error', { message: 'Missing required fields' });
      return;
    }

    const chatRoomId = [senderId, receiverId].sort().join('-');

    io.to(`chat:${chatRoomId}`).emit('receive-message', message);

    logger.info(`✅ Message sent to chat room: chat:${chatRoomId}`);
  } catch (error) {
    logger.error('⚠️ Error handling send-message:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

export const handleTyping = (
  socket: CustomSocket,
  data: TypingPayload
): void => {
  try {
    const { senderId, receiverId } = data;
    if (!senderId || !receiverId) return;

    const chatRoomId = [senderId, receiverId].sort().join('-');
    socket
      .to(`chat:${chatRoomId}`)
      .emit('user-typing', { userId: senderId });
  } catch (error) {
    logger.error('⚠️ Error handling typing:', error);
  }
};

export const handleStopTyping = (
  socket: CustomSocket,
  data: TypingPayload
): void => {
  try {
    const { senderId, receiverId } = data;
    if (!senderId || !receiverId) return;

    const chatRoomId = [senderId, receiverId].sort().join('-');
    socket
      .to(`chat:${chatRoomId}`)
      .emit('user-stop-typing', { userId: senderId });
  } catch (error) {
    logger.error('⚠️ Error handling stop-typing:', error);
  }
};

export const handleLeaveChat = (
  socket: CustomSocket,
  data: JoinChatPayload
): void => {
  try {
    const { senderId, receiverId } = data;
    if (!senderId || !receiverId) return;

    const chatRoomId = [senderId, receiverId].sort().join('-');
    socket.leave(`chat:${chatRoomId}`);
  } catch (error) {
    logger.error('⚠️ Error handling leave-chat:', error);
  }
};

export const handleDisconnect = (
  io: Server,
  socket: CustomSocket
): void => {
  const userId = socket.userId;

  if (userId) {
    onlineUsers.delete(userId);
    io.emit('user-offline', { userId });
    logger.info(`🔴 User ${userId} disconnected and marked offline`);
  }
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};
