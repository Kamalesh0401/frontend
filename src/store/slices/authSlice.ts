// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { User, AuthState } from '../../types';
// import { AuthService } from '../../services/AuthService';

// const initialState: AuthState = {
//     user: null,
//     token: localStorage.getItem('token'),
//     refreshToken: localStorage.getItem('refreshToken'),
//     isLoading: false,
//     error: null,
// };

// export const login = createAsyncThunk(
//     'auth/login',
//     async (credentials: { email: string; password: string }) => {
//         const response = await AuthService.login(credentials);
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('refreshToken', response.refreshToken);
//         return response;
//     }
// );

// export const register = createAsyncThunk(
//     'auth/register',
//     async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
//         const response = await AuthService.register(userData);
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('refreshToken', response.refreshToken);
//         return response;
//     }
// );

// export const logout = createAsyncThunk('auth/logout', async () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     await AuthService.logout();
// });

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         clearError: (state) => {
//             state.error = null;
//         },
//         setUser: (state, action: PayloadAction<User>) => {
//             state.user = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Login cases
//             .addCase(login.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 state.refreshToken = action.payload.refreshToken;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.error.message || 'Login failed';
//             })
//             // Register cases
//             .addCase(register.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(register.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 state.refreshToken = action.payload.refreshToken;
//             })
//             .addCase(register.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.error.message || 'Registration failed';
//             })
//             // Logout cases
//             .addCase(logout.fulfilled, (state) => {
//                 state.user = null;
//                 state.token = null;
//                 state.refreshToken = null;
//             });
//     },
// });

// export const { clearError, setUser } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';
import { AuthService } from '../../services/AuthService';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isLoading: false,
    error: null,
};

// ✅ Define the response type from AuthService
interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

// ✅ Login thunk
export const login = createAsyncThunk<AuthResponse, { email: string; password: string }>(
    'auth/login',
    async (credentials) => {
        const response = await AuthService.login(credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        console.log('Login response:', response); // Debugging line
        return response;
    }
);

// ✅ Register thunk
export const register = createAsyncThunk<AuthResponse, { email: string; password: string; firstName: string; lastName: string }>(
    'auth/register',
    async (userData) => {
        const response = await AuthService.register(userData);
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response;
    }
);

// ✅ Logout thunk (no return type needed)
export const logout = createAsyncThunk<void>(
    'auth/logout',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        await AuthService.logout();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.refreshToken = null;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
