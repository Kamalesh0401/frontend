import { Report } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class SafetyService {
    private static baseUrl = '/api/v1/safety';

    static async reportUser(report: {
        reportedUserId: string;
        reason: Report['reason'];
        description: string;
    }): Promise<Report> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newReport: Report = {
            id: uuidv4(),
            reporterId: '1', // Current user
            reportedUserId: report.reportedUserId,
            reason: report.reason,
            description: report.description,
            status: 'pending',
            createdAt: new Date(),
        };

        return newReport;
    }

    static async blockUser(userId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Add to blocked users list in localStorage for demo
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        blockedUsers.push(userId);
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    }

    static async unblockUser(userId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        const filtered = blockedUsers.filter((id: string) => id !== userId);
        localStorage.setItem('blockedUsers', JSON.stringify(filtered));
    }

    static async getBlockedUsers(): Promise<string[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    }

    static async getReports(): Promise<Report[]> {
        await new Promise(resolve => setTimeout(resolve, 600));

        // Mock reports for admin dashboard
        return [
            {
                id: '1',
                reporterId: '1',
                reportedUserId: '4',
                reason: 'harassment',
                description: 'User was sending inappropriate messages',
                status: 'investigating',
                createdAt: new Date(Date.now() - 86400000),
            },
            {
                id: '2',
                reporterId: '5',
                reportedUserId: '6',
                reason: 'fake_profile',
                description: 'Profile appears to be using fake photos',
                status: 'pending',
                createdAt: new Date(Date.now() - 172800000),
            }
        ];
    }

    static async updateReportStatus(reportId: string, status: Report['status']): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400));
    }

    static async getContentModerationQueue(): Promise<{
        profiles: any[];
        messages: any[];
    }> {
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            profiles: [
                {
                    id: '7',
                    userId: '7',
                    bio: 'Content that needs moderation review',
                    flaggedReason: 'inappropriate_content',
                    flaggedAt: new Date(),
                }
            ],
            messages: [
                {
                    id: '8',
                    content: 'Message flagged by AI for review',
                    flaggedReason: 'potential_harassment',
                    flaggedAt: new Date(),
                }
            ]
        };
    }
}