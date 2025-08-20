// Core application types
export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen: Date;
    isVerified: boolean;
    isPremium: boolean;
    createdAt: Date;
}

export interface Profile {
    id: string;
    userId: string;
    bio: string;
    age: number;
    location: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    images: string[];
    interests: string[];
    lookingFor: 'relationship' | 'dating' | 'friends' | 'networking';
    completionPercentage: number;
    isVisible: boolean;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    preferences: {
        ageRange: [number, number];
        maxDistance: number;
        showOnlineOnly: boolean;
    };
}

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'video' | 'audio';
    timestamp: Date;
    isRead: boolean;
    isEncrypted: boolean;
}

export interface Chat {
    id: string;
    participants: string[];
    lastMessage?: Message;
    unreadCount: number;
    isGroup: boolean;
    groupName?: string;
    createdAt: Date;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'match' | 'message' | 'like' | 'profile_view' | 'system';
    title: string;
    body: string;
    isRead: boolean;
    actionUrl?: string;
    timestamp: Date;
}

export interface Report {
    id: string;
    reporterId: string;
    reportedUserId: string;
    reason: 'harassment' | 'fake_profile' | 'inappropriate_content' | 'spam' | 'other';
    description: string;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    createdAt: Date;
}

export interface Subscription {
    id: string;
    userId: string;
    plan: 'basic' | 'premium' | 'vip';
    status: 'active' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    paymentMethod: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface AppState {
    auth: AuthState;
    profile: Profile | null;
    matches: User[];
    chats: Chat[];
    notifications: Notification[];
    isOnline: boolean;
}