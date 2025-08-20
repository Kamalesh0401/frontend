import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, MessageCircle, User, Check, Star } from 'lucide-react';
import { RootState } from '../../store';
import { getNotifications, markAsRead } from '../../store/slices/notificationSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const NotificationsPage: React.FC = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount, isLoading } = useSelector((state: RootState) => state.notifications);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (notificationId: string) => {
        dispatch(markAsRead(notificationId));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'match':
                return <Heart className="h-5 w-5 text-pink-500" />;
            case 'message':
                return <MessageCircle className="h-5 w-5 text-blue-500" />;
            case 'like':
                return <Heart className="h-5 w-5 text-red-500 fill-current" />;
            case 'profile_view':
                return <User className="h-5 w-5 text-purple-500" />;
            case 'system':
                return <Bell className="h-5 w-5 text-gray-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Loading notifications..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-xl shadow-lg">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                {unreadCount > 0 && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        notifications
                                            .filter(n => !n.isRead)
                                            .forEach(n => handleMarkAsRead(n.id));
                                    }}
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="divide-y divide-gray-200">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                                <p className="text-gray-600">We'll notify you when something interesting happens!</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`p-4 border-none shadow-none rounded-none cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Icon */}
                                        <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-white' : 'bg-gray-100'
                                            }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'
                                                        }`}>
                                                        {notification.body}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                    </p>
                                                </div>

                                                {/* Unread indicator */}
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Notification Settings */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Notification Settings</h3>
                                <p className="text-sm text-gray-600">Manage your notification preferences</p>
                            </div>
                            <Button variant="outline" size="sm">
                                Customize
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;