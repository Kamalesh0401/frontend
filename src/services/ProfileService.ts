import { Profile } from '../types';

export class ProfileService {
    private static baseUrl = '/api/v1/profile';

    static async createProfile(profileData: Partial<Profile>): Promise<Profile> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const profile: Profile = {
            id: Date.now().toString(),
            userId: '1', // Mock user ID
            bio: profileData.bio || '',
            age: profileData.age || 25,
            location: profileData.location || {
                city: 'San Francisco',
                country: 'USA',
                coordinates: { lat: 37.7749, lng: -122.4194 }
            },
            images: profileData.images || [
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400'
            ],
            interests: profileData.interests || ['Travel', 'Music', 'Photography'],
            lookingFor: profileData.lookingFor || 'relationship',
            completionPercentage: 75,
            isVisible: true,
            verificationStatus: 'pending',
            preferences: {
                ageRange: [22, 35],
                maxDistance: 50,
                showOnlineOnly: false,
            },
        };

        return profile;
    }

    static async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock updated profile
        return {
            ...profileData as Profile,
            completionPercentage: this.calculateCompletionPercentage(profileData),
        };
    }

    static async getProfile(userId: string): Promise<Profile> {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            id: userId,
            userId,
            bio: 'Love traveling, photography, and meeting new people. Looking for genuine connections!',
            age: 28,
            location: {
                city: 'Los Angeles',
                country: 'USA',
                coordinates: { lat: 34.0522, lng: -118.2437 }
            },
            images: [
                'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400',
                'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=400',
            ],
            interests: ['Travel', 'Photography', 'Hiking', 'Coffee', 'Movies'],
            lookingFor: 'relationship',
            completionPercentage: 95,
            isVisible: true,
            verificationStatus: 'verified',
            preferences: {
                ageRange: [25, 35],
                maxDistance: 30,
                showOnlineOnly: false,
            },
        };
    }

    static async getMatches(): Promise<Profile[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return [
            {
                id: '2',
                userId: '2',
                bio: 'Adventure seeker and coffee enthusiast. Always up for trying new restaurants!',
                age: 26,
                location: { city: 'San Francisco', country: 'USA' },
                images: ['https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400'],
                interests: ['Food', 'Adventure', 'Travel'],
                lookingFor: 'dating',
                completionPercentage: 88,
                isVisible: true,
                verificationStatus: 'verified',
                preferences: { ageRange: [24, 32], maxDistance: 25, showOnlineOnly: false },
            },
            {
                id: '3',
                userId: '3',
                bio: 'Dog lover, yoga instructor, and amateur chef. Looking for someone to share life\'s adventures!',
                age: 29,
                location: { city: 'San Francisco', country: 'USA' },
                images: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=400'],
                interests: ['Yoga', 'Cooking', 'Dogs', 'Nature'],
                lookingFor: 'relationship',
                completionPercentage: 92,
                isVisible: true,
                verificationStatus: 'verified',
                preferences: { ageRange: [26, 35], maxDistance: 40, showOnlineOnly: false },
            }
        ];
    }

    static async uploadImage(file: File): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock image upload - in real app this would upload to S3/Cloudinary
        return URL.createObjectURL(file);
    }

    static async likeProfile(profileId: string): Promise<{ matched: boolean }> {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock 30% chance of matching
        const matched = Math.random() > 0.7;
        return { matched };
    }

    static async passProfile(profileId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    private static calculateCompletionPercentage(profile: Partial<Profile>): number {
        let completed = 0;
        const total = 8;

        if (profile.bio) completed++;
        if (profile.age) completed++;
        if (profile.location) completed++;
        if (profile.images && profile.images.length > 0) completed++;
        if (profile.interests && profile.interests.length > 0) completed++;
        if (profile.lookingFor) completed++;

        return Math.round((completed / total) * 100);
    }
}