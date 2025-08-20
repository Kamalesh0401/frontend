import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import profileSlice from './slices/profileSlice';
import chatSlice from './slices/chatSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        profile: profileSlice,
        chat: chatSlice,
        notifications: notificationSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;