import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowLeft,
    Send,
    Image,
    Phone,
    Video,
    MoreVertical,
    Smile
} from 'lucide-react';
import { RootState } from '../../store';
import {
    getMessages,
    sendMessage,
    markAsRead,
    setActiveChat
} from '../../store/slices/chatSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useSocket } from '../../hooks/useSocket';
import toast from 'react-hot-toast';

const ChatRoomPage: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { activeChat, messages, typingUsers, isConnected } = useSelector((state: RootState) => state.chat);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { emitTyping, joinChat, leaveChat } = useSocket(user?.id || null);

    const chatMessages = chatId ? messages[chatId] || [] : [];
    const currentTypingUsers = chatId ? typingUsers[chatId] || [] : [];

    useEffect(() => {
        if (chatId) {
            dispatch(getMessages(chatId));
            dispatch(markAsRead(chatId));
            joinChat(chatId);

            return () => {
                leaveChat(chatId);
                dispatch(setActiveChat(null));
            };
        }
    }, [chatId, dispatch, joinChat, leaveChat]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;

        try {
            await dispatch(sendMessage({ chatId, content: newMessage.trim() }));
            setNewMessage('');
            handleStopTyping();
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleTyping = (value: string) => {
        setNewMessage(value);

        if (!isTyping && value.trim()) {
            setIsTyping(true);
            emitTyping(chatId!, true);
        }

        // Reset typing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            handleStopTyping();
        }, 2000);
    };

    const handleStopTyping = () => {
        if (isTyping) {
            setIsTyping(false);
            emitTyping(chatId!, false);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    };

    if (!chatId) {
        return <div>Chat not found</div>;
    }

    const otherUserName = chatId === '1' ? 'Sarah' : 'Emily';
    const otherUserAvatar = `https://images.pexels.com/photos/${chatId === '1' ? '415829' : '1130626'}/pexels-photo-${chatId === '1' ? '415829' : '1130626'}.jpeg?w=100`;

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/chat')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img
                                    src={otherUserAvatar}
                                    alt={otherUserName}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">{otherUserName}</h2>
                                <p className="text-sm text-gray-500">
                                    {isConnected ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Voice call feature coming soon!')}
                        >
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Video call feature coming soon!')}
                        >
                            <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="bg-white rounded-lg p-6 inline-block">
                            <p className="text-gray-600">Start your conversation with {otherUserName}!</p>
                        </div>
                    </div>
                ) : (
                    chatMessages.map((message, index) => {
                        const isOwn = message.senderId === user?.id;
                        const showTime = index === 0 ||
                            (chatMessages[index - 1] &&
                                new Date(message.timestamp).getTime() - new Date(chatMessages[index - 1].timestamp).getTime() > 300000);

                        return (
                            <div key={message.id}>
                                {showTime && (
                                    <div className="text-center text-xs text-gray-500 mb-4">
                                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                    </div>
                                )}

                                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                                        <Card className={`p-3 ${isOwn
                                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                                                : 'bg-white text-gray-900'
                                            }`}>
                                            {message.type === 'image' ? (
                                                <img
                                                    src={message.content}
                                                    alt="Shared image"
                                                    className="rounded-lg max-w-full h-auto"
                                                />
                                            ) : (
                                                <p className="text-sm">{message.content}</p>
                                            )}
                                        </Card>
                                    </div>

                                    {!isOwn && (
                                        <img
                                            src={otherUserAvatar}
                                            alt={otherUserName}
                                            className="h-8 w-8 rounded-full object-cover order-0 mr-2"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Typing Indicator */}
                {currentTypingUsers.length > 0 && (
                    <div className="flex justify-start">
                        <div className="flex items-center space-x-2">
                            <img
                                src={otherUserAvatar}
                                alt={otherUserName}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <Card className="p-3 bg-white">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info('Image sharing feature coming soon!')}
                    >
                        <Image className="h-5 w-5" />
                    </Button>

                    <div className="flex-1">
                        <Input
                            value={newMessage}
                            onChange={(e) => handleTyping(e.target.value)}
                            placeholder="Type a message..."
                            className="border-none bg-gray-100 focus:bg-white"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info('Emoji picker coming soon!')}
                    >
                        <Smile className="h-5 w-5" />
                    </Button>

                    <Button
                        type="submit"
                        disabled={!newMessage.trim()}
                        size="sm"
                        className="rounded-full"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoomPage;