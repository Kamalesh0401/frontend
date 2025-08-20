import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message } from '../../types';
import { ChatService } from '../../services/ChatService';

interface ChatState {
    chats: Chat[];
    activeChat: Chat | null;
    messages: { [chatId: string]: Message[] };
    isLoading: boolean;
    isConnected: boolean;
    typingUsers: { [chatId: string]: string[] };
}

const initialState: ChatState = {
    chats: [],
    activeChat: null,
    messages: {},
    isLoading: false,
    isConnected: false,
    typingUsers: {},
};

export const getChats = createAsyncThunk('chat/getChats', async () => {
    return await ChatService.getChats();
});

export const getMessages = createAsyncThunk(
    'chat/getMessages',
    async (chatId: string) => {
        return await ChatService.getMessages(chatId);
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ chatId, content }: { chatId: string; content: string }) => {
        return await ChatService.sendMessage(chatId, content);
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<Chat | null>) => {
            state.activeChat = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            if (!state.messages[message.chatId]) {
                state.messages[message.chatId] = [];
            }
            state.messages[message.chatId].push(message);
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setTyping: (state, action: PayloadAction<{ chatId: string; userId: string; isTyping: boolean }>) => {
            const { chatId, userId, isTyping } = action.payload;
            if (!state.typingUsers[chatId]) {
                state.typingUsers[chatId] = [];
            }

            const existingIndex = state.typingUsers[chatId].indexOf(userId);
            if (isTyping && existingIndex === -1) {
                state.typingUsers[chatId].push(userId);
            } else if (!isTyping && existingIndex > -1) {
                state.typingUsers[chatId].splice(existingIndex, 1);
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;
            const chat = state.chats.find(c => c.id === chatId);
            if (chat) {
                chat.unreadCount = 0;
            }

            if (state.messages[chatId]) {
                state.messages[chatId].forEach(msg => {
                    msg.isRead = true;
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChats.fulfilled, (state, action) => {
                state.chats = action.payload;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                const { chatId, messages } = action.payload;
                state.messages[chatId] = messages;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const message = action.payload;
                if (!state.messages[message.chatId]) {
                    state.messages[message.chatId] = [];
                }
                state.messages[message.chatId].push(message);
            });
    },
});

export const { setActiveChat, addMessage, setConnected, setTyping, markAsRead } = chatSlice.actions;
export default chatSlice.reducer;