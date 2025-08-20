import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types';
import { ProfileService } from '../../services/ProfileService';

interface ProfileState {
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
    matches: Profile[];
    viewedProfiles: string[];
}

const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
    matches: [],
    viewedProfiles: [],
};

export const createProfile = createAsyncThunk(
    'profile/create',
    async (profileData: Partial<Profile>) => {
        return await ProfileService.createProfile(profileData);
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async (profileData: Partial<Profile>) => {
        return await ProfileService.updateProfile(profileData);
    }
);

export const getMatches = createAsyncThunk(
    'profile/getMatches',
    async () => {
        return await ProfileService.getMatches();
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        addViewedProfile: (state, action: PayloadAction<string>) => {
            state.viewedProfiles.push(action.payload);
        },
        removeMatch: (state, action: PayloadAction<string>) => {
            state.matches = state.matches.filter(match => match.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create profile';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(getMatches.fulfilled, (state, action) => {
                state.matches = action.payload;
            });
    },
});

export const { clearError, addViewedProfile, removeMatch } = profileSlice.actions;
export default profileSlice.reducer;