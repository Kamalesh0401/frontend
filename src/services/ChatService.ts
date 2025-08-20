import { Chat, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
    private static baseUrl = '/api/v1/chat';

    static async getChats(): Promise<Chat[]> {
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            {
                id: '1',
                participants: ['1', '2'],
                lastMessage: {
                    id: '1',
                    chatId: '1',
                    senderId: '2',
                    content: 'Hey! How was your weekend?',
                    type: 'text',
                    timestamp: new Date(Date.now() - 3600000),
                    isRead: false,
                    isEncrypted: true,
                },
                unreadCount: 1,
                isGroup: false,
                createdAt: new Date(Date.now() - 86400000),
            },
            {
                id: '2',
                participants: ['1', '3'],
                lastMessage: {
                    id: '2',
                    chatId: '2',
                    senderId: '1',
                    content: 'Thanks for the coffee recommendation!',
                    type: 'text',
                    timestamp: new Date(Date.now() - 7200000),
                    isRead: true,
                    isEncrypted: true,
                },
                unreadCount: 0,
                isGroup: false,
                createdAt: new Date(Date.now() - 172800000),
            }
        ];
    }

    static async getMessages(chatId: string): Promise<{ chatId: string; messages: Message[] }> {
        await new Promise(resolve => setTimeout(resolve, 600));

        const messages: Message[] = [
            {
                id: '1',
                chatId,
                senderId: chatId === '1' ? '2' : '3',
                content: 'Hi there! Nice to meet you 😊',
                type: 'text',
                timestamp: new Date(Date.now() - 86400000),
                isRead: true,
                isEncrypted: true,
            },
            {
                id: '2',
                chatId,
                senderId: '1',
                content: 'Hello! Great to connect with you too!',
                type: 'text',
                timestamp: new Date(Date.now() - 82800000),
                isRead: true,
                isEncrypted: true,
            },
            {
                id: '3',
                chatId,
                senderId: chatId === '1' ? '2' : '3',
                content: chatId === '1' ? 'Hey! How was your weekend?' : 'What are your favorite coffee spots in the city?',
                type: 'text',
                timestamp: new Date(Date.now() - 3600000),
                isRead: false,
                isEncrypted: true,
            }
        ];

        return { chatId, messages };
    }

    static async sendMessage(chatId: string, content: string): Promise<Message> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const message: Message = {
            id: uuidv4(),
            chatId,
            senderId: '1', // Current user
            content,
            type: 'text',
            timestamp: new Date(),
            isRead: false,
            isEncrypted: true,
        };

        return message;
    }

    static async createChat(participantId: string): Promise<Chat> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const chat: Chat = {
            id: uuidv4(),
            participants: ['1', participantId],
            unreadCount: 0,
            isGroup: false,
            createdAt: new Date(),
        };

        return chat;
    }

    static async markAsRead(chatId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    static async uploadMedia(file: File, chatId: string): Promise<Message> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const message: Message = {
            id: uuidv4(),
            chatId,
            senderId: '1',
            content: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            timestamp: new Date(),
            isRead: false,
            isEncrypted: true,
        };

        return message;
    }
}