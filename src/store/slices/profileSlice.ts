// src/store/slices/profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../types";
import { ProfileService } from "../../services/ProfileService";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  matches: Profile[];
  matchesLoading: boolean;
  viewedProfiles: string[];
  lastFetch: number | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
  matches: [],
  matchesLoading: false,
  viewedProfiles: [],
  lastFetch: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Fetch user profile
 */
export const fetchProfile = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("profile/fetch", async (userId, { rejectWithValue }) => {
  try {
    console.log("Fetching profile for userId:", userId);
    const profile = await ProfileService.getProfile(userId);
    console.log("Profile fetched successfully:", profile);
    return profile;
  } catch (err: any) {
    console.error("Fetch profile error:", err);
    return rejectWithValue(err.message || "Failed to fetch profile");
  }
});

/**
 * ✅ CORRECTED: Update profile with proper data transformation
 */
export const updateProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>("profile/update", async (profileData, { rejectWithValue }) => {
  try {
    console.log("Updating profile with data:", profileData);
    const updatedProfile = await ProfileService.updateProfile(profileData);
    console.log("Profile updated successfully:", updatedProfile);
    return updatedProfile;
  } catch (err: any) {
    console.error("Update profile error:", err);
    return rejectWithValue(err.message || "Failed to update profile");
  }
});

/**
 * Create new profile
 */
export const createProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>("profile/create", async (profileData, { rejectWithValue }) => {
  try {
    console.log("Creating profile with data:", profileData);
    const newProfile = await ProfileService.createProfile(profileData);
    console.log("Profile created successfully:", newProfile);
    return newProfile;
  } catch (err: any) {
    console.error("Create profile error:", err);
    return rejectWithValue(err.message || "Failed to create profile");
  }
});

/**
 * ✅ CORRECTED: Get potential matches
 */
export const getMatches = createAsyncThunk<
  Profile[],
  { userId?: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "profile/getMatches",
  async ({ userId, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      console.log("Fetching matches...");
      const matches = await ProfileService.getMatches(userId, page, limit);
      console.log("Matches fetched:", matches.length);
      return matches;
    } catch (err: any) {
      console.error("Get matches error:", err);
      return rejectWithValue(err.message || "Failed to get matches");
    }
  }
);

/**
 * Like a profile
 */
export const likeProfile = createAsyncThunk<
  { profileId: string; matched: boolean },
  string,
  { rejectValue: string }
>("profile/likeProfile", async (profileId, { rejectWithValue }) => {
  try {
    console.log("Liking profile:", profileId);
    const result = await ProfileService.likeProfile(profileId);
    console.log("Like result:", result);
    return { profileId, matched: result.matched };
  } catch (err: any) {
    console.error("Like profile error:", err);
    return rejectWithValue(err.message || "Failed to like profile");
  }
});

/**
 * Pass a profile
 */
export const passProfile = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("profile/passProfile", async (profileId, { rejectWithValue }) => {
  try {
    console.log("Passing profile:", profileId);
    await ProfileService.passProfile(profileId);
    console.log("Profile passed successfully");
    return profileId;
  } catch (err: any) {
    console.error("Pass profile error:", err);
    return rejectWithValue(err.message || "Failed to pass profile");
  }
});

// ==================== SLICE ====================

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },

    addViewedProfile(state, action: PayloadAction<string>) {
      if (!state.viewedProfiles.includes(action.payload)) {
        state.viewedProfiles.push(action.payload);
      }
    },

    removeMatch(state, action: PayloadAction<string>) {
      state.matches = state.matches.filter((m) => m.id !== action.payload);
    },

    setMatches(state, action: PayloadAction<Profile[]>) {
      state.matches = action.payload;
    },

    resetProfileState(state) {
      state.profile = null;
      state.matches = [];
      state.error = null;
      state.viewedProfiles = [];
      state.lastFetch = null;
    },
  },

  extraReducers(builder) {
    // ==================== FETCH PROFILE ====================
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch profile";
      })

      // ==================== CREATE PROFILE ====================
      .addCase(createProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.profile = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error =
          action.payload || action.error.message || "Failed to create profile";
      })

      // ==================== UPDATE PROFILE ====================
      .addCase(updateProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.profile = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error =
          action.payload || action.error.message || "Failed to update profile";
      })

      // ==================== GET MATCHES ====================
      .addCase(getMatches.pending, (state) => {
        state.matchesLoading = true;
        state.error = null;
      })
      .addCase(getMatches.fulfilled, (state, action) => {
        state.matchesLoading = false;
        state.matches = action.payload;
      })
      .addCase(getMatches.rejected, (state, action) => {
        state.matchesLoading = false;
        state.error =
          action.payload || action.error.message || "Failed to get matches";
      })

      // ==================== LIKE PROFILE ====================
      .addCase(likeProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(likeProfile.fulfilled, (state, action) => {
        // Remove liked profile from matches list
        state.matches = state.matches.filter(
          (m) => m.id !== action.payload.profileId
        );

        // Add to viewed profiles
        if (!state.viewedProfiles.includes(action.payload.profileId)) {
          state.viewedProfiles.push(action.payload.profileId);
        }
      })
      .addCase(likeProfile.rejected, (state, action) => {
        state.error =
          action.payload || action.error.message || "Failed to like profile";
      })

      // ==================== PASS PROFILE ====================
      .addCase(passProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(passProfile.fulfilled, (state, action) => {
        // Remove passed profile from matches
        state.matches = state.matches.filter((m) => m.id !== action.payload);

        // Add to viewed profiles
        if (!state.viewedProfiles.includes(action.payload)) {
          state.viewedProfiles.push(action.payload);
        }
      })
      .addCase(passProfile.rejected, (state, action) => {
        state.error =
          action.payload || action.error.message || "Failed to pass profile";
      });
  },
});

// ==================== EXPORTS ====================

export const {
  clearError,
  addViewedProfile,
  removeMatch,
  setMatches,
  resetProfileState,
} = profileSlice.actions;

export default profileSlice.reducer;

// ==================== SELECTORS ====================

// Memoized selectors for better performance
export const selectProfile = (state: { profile: ProfileState }) =>
  state.profile.profile;
export const selectMatches = (state: { profile: ProfileState }) =>
  state.profile.matches;
export const selectIsLoading = (state: { profile: ProfileState }) =>
  state.profile.isLoading;
export const selectIsSaving = (state: { profile: ProfileState }) =>
  state.profile.isSaving;
export const selectError = (state: { profile: ProfileState }) =>
  state.profile.error;
export const selectMatchesLoading = (state: { profile: ProfileState }) =>
  state.profile.matchesLoading;
export const selectViewedProfiles = (state: { profile: ProfileState }) =>
  state.profile.viewedProfiles;
