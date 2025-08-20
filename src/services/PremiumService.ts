import { Subscription } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class PremiumService {
    private static baseUrl = '/api/v1/premium';

    static async getSubscription(): Promise<Subscription | null> {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock premium subscription
        return {
            id: '1',
            userId: '1',
            plan: 'premium',
            status: 'active',
            startDate: new Date(Date.now() - 604800000), // 1 week ago
            endDate: new Date(Date.now() + 2592000000), // 30 days from now
            autoRenew: true,
            paymentMethod: '**** 1234',
        };
    }

    static async getPlans(): Promise<{
        basic: { name: string; price: number; features: string[] };
        premium: { name: string; price: number; features: string[] };
        vip: { name: string; price: number; features: string[] };
    }> {
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            basic: {
                name: 'Basic',
                price: 0,
                features: [
                    'Limited likes per day',
                    'Basic matching',
                    'Standard support'
                ]
            },
            premium: {
                name: 'Premium',
                price: 19.99,
                features: [
                    'Unlimited likes',
                    'Advanced filters',
                    'See who liked you',
                    'Boost your profile',
                    'Priority support',
                    'Ad-free experience'
                ]
            },
            vip: {
                name: 'VIP',
                price: 39.99,
                features: [
                    'Everything in Premium',
                    'Super boost',
                    'Read receipts',
                    'Advanced analytics',
                    'VIP badge',
                    'Exclusive features'
                ]
            }
        };
    }

    static async subscribe(plan: 'basic' | 'premium' | 'vip', paymentMethodId: string): Promise<Subscription> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const subscription: Subscription = {
            id: uuidv4(),
            userId: '1',
            plan,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 2592000000), // 30 days
            autoRenew: true,
            paymentMethod: '**** ' + Math.floor(Math.random() * 9999),
        };

        return subscription;
    }

    static async cancelSubscription(subscriptionId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    static async updatePaymentMethod(subscriptionId: string, paymentMethodId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    static async getBillingHistory(): Promise<{
        id: string;
        amount: number;
        date: Date;
        status: 'paid' | 'pending' | 'failed';
        description: string;
    }[]> {
        await new Promise(resolve => setTimeout(resolve, 600));

        return [
            {
                id: '1',
                amount: 19.99,
                date: new Date(Date.now() - 604800000),
                status: 'paid',
                description: 'Premium Monthly Subscription'
            },
            {
                id: '2',
                amount: 19.99,
                date: new Date(Date.now() - 3196800000),
                status: 'paid',
                description: 'Premium Monthly Subscription'
            }
        ];
    }

    static async getUsageAnalytics(): Promise<{
        profileViews: number;
        likes: number;
        matches: number;
        messages: number;
        boosts: number;
    }> {
        await new Promise(resolve => setTimeout(resolve, 400));

        return {
            profileViews: 245,
            likes: 89,
            matches: 12,
            messages: 156,
            boosts: 3,
        };
    }
}