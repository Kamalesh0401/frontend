import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Crown, Check, Zap, Star, TrendingUp, Shield } from 'lucide-react';
import { RootState } from '../../store';
import { PremiumService } from '../../services/PremiumService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const PremiumPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [plans, setPlans] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [plansData, subscriptionData, analyticsData] = await Promise.all([
                PremiumService.getPlans(),
                PremiumService.getSubscription(),
                PremiumService.getUsageAnalytics()
            ]);

            setPlans(plansData);
            setSubscription(subscriptionData);
            setAnalytics(analyticsData);
        } catch (error) {
            toast.error('Failed to load premium data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubscribe = async (plan: 'basic' | 'premium' | 'vip') => {
        try {
            await PremiumService.subscribe(plan, 'mock_payment_method');
            toast.success(`Successfully subscribed to ${plan}!`);
            loadData();
        } catch (error) {
            toast.error('Subscription failed');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Loading premium features..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header */}
                <div className="text-center py-12">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <Crown className="h-12 w-12 text-yellow-500" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            FunJok Premium
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock premium features and supercharge your dating experience with advanced matching,
                        unlimited likes, and exclusive insights.
                    </p>
                </div>

                {/* Current Subscription Status */}
                {subscription && (
                    <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Crown className="h-8 w-8" />
                                    <div>
                                        <h3 className="text-xl font-bold">Current Plan: {subscription.plan.toUpperCase()}</h3>
                                        <p className="text-purple-100">
                                            {subscription.status === 'active' ? 'Active until' : 'Status:'} {' '}
                                            {new Date(subscription.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-purple-100">Auto-renew</p>
                                    <p className="font-semibold">{subscription.autoRenew ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Usage Analytics */}
                {analytics && user?.isPremium && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Premium Analytics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <Card className="p-4 text-center">
                                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{analytics.profileViews}</p>
                                <p className="text-sm text-gray-600">Profile Views</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{analytics.likes}</p>
                                <p className="text-sm text-gray-600">Likes Received</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{analytics.matches}</p>
                                <p className="text-sm text-gray-600">Total Matches</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{analytics.messages}</p>
                                <p className="text-sm text-gray-600">Messages Sent</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{analytics.boosts}</p>
                                <p className="text-sm text-gray-600">Boosts Used</p>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Pricing Plans */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Your Plan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans && Object.entries(plans).map(([key, plan]: [string, any]) => (
                            <Card
                                key={key}
                                className={`p-8 text-center relative ${key === 'premium'
                                        ? 'border-2 border-purple-500 shadow-xl scale-105'
                                        : ''
                                    }`}
                            >
                                {key === 'premium' && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-bold text-gray-900">
                                        {key === 'basic' ? 'Free' : `$${plan.price}`}
                                        {key !== 'basic' && <span className="text-lg text-gray-600">/month</span>}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700 text-left">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => handleSubscribe(key as any)}
                                    disabled={subscription?.plan === key && subscription?.status === 'active'}
                                    className="w-full"
                                    variant={key === 'premium' ? 'primary' : 'outline'}
                                >
                                    {subscription?.plan === key && subscription?.status === 'active'
                                        ? 'Current Plan'
                                        : key === 'basic'
                                            ? 'Current Plan'
                                            : 'Upgrade Now'
                                    }
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features Showcase */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Why Choose Premium?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-pink-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Boost Your Profile</h3>
                            <p className="text-gray-600">Be one of the top profiles in your area for 30 minutes</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="h-8 w-8 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">See Who Likes You</h3>
                            <p className="text-gray-600">Skip the guessing game and see your admirers</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                            <p className="text-gray-600">Get insights on your profile performance and optimize for success</p>
                        </div>
                    </div>
                </div>

                {/* Trust & Security */}
                <div className="text-center mt-12 text-gray-600">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <Shield className="h-5 w-5" />
                        <span>Secure payments powered by Stripe</span>
                    </div>
                    <p className="text-sm">
                        Cancel anytime • 30-day money back guarantee • 24/7 customer support
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumPage;