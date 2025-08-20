import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage, setConnected, setTyping } from '../store/slices/chatSlice';
import { addNotification } from '../store/slices/notificationSlice';
import { NotificationService } from '../services/NotificationService';

export const useSocket = (userId: string | null) => {
  const dispatch = useDispatch();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    // Simulate WebSocket connection
    const mockSocket = {
      connected: true,
      emit: (event: string, data: any) => {
        console.log('Socket emit:', event, data);
      },
      on: (event: string, callback: (data: any) => void) => {
        // Mock event listeners
      },
      disconnect: () => {
        console.log('Socket disconnected');
      }
    };

    socketRef.current = mockSocket;
    dispatch(setConnected(true));

    // Simulate real-time notifications
    const notificationInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 2 seconds
        const types = ['like', 'match', 'message', 'profile_view'];
        const randomType = types[Math.floor(Math.random() * types.length)] as any;
        const notification = NotificationService.createMockNotification(randomType);
        dispatch(addNotification(notification));
      }
    }, 2000);

    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.98) { // 2% chance every 3 seconds
        dispatch(setTyping({
          chatId: '1',
          userId: '2',
          isTyping: true
        }));
        
        setTimeout(() => {
          dispatch(setTyping({
            chatId: '1',
            userId: '2',
            isTyping: false
          }));
        }, 2000);
      }
    }, 3000);

    return () => {
      clearInterval(notificationInterval);
      clearInterval(typingInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
        dispatch(setConnected(false));
      }
    };
  }, [userId, dispatch]);

  const emitTyping = (chatId: string, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { chatId, isTyping });
    }
  };

  const joinChat = (chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_chat', { chatId });
    }
  };

  const leaveChat = (chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_chat', { chatId });
    }
  };

  return {
    socket: socketRef.current,
    emitTyping,
    joinChat,
    leaveChat,
  };
};