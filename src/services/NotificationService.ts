import { Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class NotificationService {
    private static baseUrl = '/api/v1/notifications';

    static async getNotifications(): Promise<Notification[]> {
        await new Promise(resolve => setTimeout(resolve, 600));

        return [
            {
                id: '1',
                userId: '1',
                type: 'match',
                title: 'New Match! 🎉',
                body: 'You and Sarah have matched!',
                isRead: false,
                timestamp: new Date(Date.now() - 3600000),
            },
            {
                id: '2',
                userId: '1',
                type: 'message',
                title: 'New Message',
                body: 'Emily sent you a message',
                isRead: false,
                actionUrl: '/chat/2',
                timestamp: new Date(Date.now() - 7200000),
            },
            {
                id: '3',
                userId: '1',
                type: 'like',
                title: 'Someone likes you! ❤️',
                body: 'You have a new like',
                isRead: true,
                timestamp: new Date(Date.now() - 86400000),
            },
            {
                id: '4',
                userId: '1',
                type: 'system',
                title: 'Profile Verification',
                body: 'Your profile has been verified!',
                isRead: true,
                timestamp: new Date(Date.now() - 172800000),
            }
        ];
    }

    static async markAsRead(notificationId: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return notificationId;
    }

    static async markAllAsRead(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    static async deleteNotification(notificationId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    static async updatePreferences(preferences: {
        push: boolean;
        email: boolean;
        matches: boolean;
        messages: boolean;
        likes: boolean;
    }): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Mock real-time notifications
    static createMockNotification(type: Notification['type']): Notification {
        const notifications = {
            match: {
                title: 'New Match! 🎉',
                body: 'You and someone new have matched!',
            },
            message: {
                title: 'New Message',
                body: 'You have a new message',
            },
            like: {
                title: 'Someone likes you! ❤️',
                body: 'You have a new like',
            },
            profile_view: {
                title: 'Profile View',
                body: 'Someone viewed your profile',
            },
            system: {
                title: 'System Notification',
                body: 'Important update from FunJok',
            },
        };

        return {
            id: uuidv4(),
            userId: '1',
            type,
            title: notifications[type].title,
            body: notifications[type].body,
            isRead: false,
            timestamp: new Date(),
        };
    }
}