import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Search } from 'lucide-react';
import { RootState } from '../../store';
import { getChats } from '../../store/slices/chatSlice';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chats, isLoading } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading your conversations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Chat List */}
          <div className="divide-y divide-gray-200">
            {chats.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600">Start matching with people to begin chatting!</p>
              </div>
            ) : (
              chats.map((chat) => (
                <Card
                  key={chat.id}
                  className="p-4 hover:bg-gray-50 border-none shadow-none rounded-none cursor-pointer"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={`https://images.pexels.com/photos/${chat.id === '1' ? '415829' : '1130626'}/pexels-photo-${chat.id === '1' ? '415829' : '1130626'}.jpeg?w=100`}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {chat.id === '1' ? 'Sarah' : 'Emily'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage && formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;