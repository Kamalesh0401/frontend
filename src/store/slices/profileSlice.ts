// src/store/slices/profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../types"; // adjust path according to your project structure
import { ProfileService } from "../../services/ProfileService";

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

// Thunks
export const createProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>("profile/create", async (profileData, { rejectWithValue }) => {
  try {
    return await ProfileService.createProfile(profileData);
  } catch (err: any) {
    return rejectWithValue(err.message || "Create profile failed");
  }
});

export const updateProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>("profile/update", async (profileData, { rejectWithValue }) => {
  try {
    return await ProfileService.updateProfile(profileData);
  } catch (err: any) {
    return rejectWithValue(err.message || "Update profile failed");
  }
});

export const fetchProfile = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("profile/fetch", async (userId, { rejectWithValue }) => {
  try {
    return await ProfileService.getProfile(userId);
  } catch (err: any) {
    return rejectWithValue(err.message || "Fetch profile failed");
  }
});

export const getMatches = createAsyncThunk<
  Profile[],
  { userId?: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "profile/getMatches",
  async ({ userId, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await ProfileService.getMatches(userId, page, limit);
    } catch (err: any) {
      return rejectWithValue(err.message || "Get matches failed");
    }
  }
);

export const likeProfile = createAsyncThunk<
  { matched: boolean },
  string,
  { rejectValue: string }
>("profile/likeProfile", async (profileId, { rejectWithValue }) => {
  try {
    return await ProfileService.likeProfile(profileId);
  } catch (err: any) {
    return rejectWithValue(err.message || "Like failed");
  }
});

export const passProfile = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("profile/passProfile", async (profileId, { rejectWithValue }) => {
  try {
    await ProfileService.passProfile(profileId);
    return profileId;
  } catch (err: any) {
    return rejectWithValue(err.message || "Pass failed");
  }
});

// Slice
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
  },
  extraReducers(builder) {
    builder
      // create
      .addCase(createProfile.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(createProfile.fulfilled, (s, a) => {
        s.isLoading = false;
        s.profile = a.payload;
      })
      .addCase(createProfile.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload || a.error.message || "Create failed";
      })

      // update
      .addCase(updateProfile.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.isLoading = false;
        s.profile = a.payload;
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload || a.error.message || "Update failed";
      })

      // fetch
      .addCase(fetchProfile.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.isLoading = false;
        s.profile = a.payload;
      })
      .addCase(fetchProfile.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload || a.error.message || "Fetch failed";
      })

      // getMatches
      .addCase(getMatches.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(getMatches.fulfilled, (s, a) => {
        s.isLoading = false;
        s.matches = a.payload;
      })
      .addCase(getMatches.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload || a.error.message || "Get matches failed";
      })

      // like
      .addCase(likeProfile.pending, (s) => {
        s.error = null;
      })
      .addCase(likeProfile.fulfilled, (s, a) => {
        // If matched, you might want to show a special UI. We'll not mutate matches here.
        // Optionally remove from available matches on like:
        // if (a.payload.matched) { ... }
      })
      .addCase(likeProfile.rejected, (s, a) => {
        s.error = a.payload || a.error.message || "Like failed";
      })

      // pass
      .addCase(passProfile.fulfilled, (s, a) => {
        // remove passed profile from matches
        s.matches = s.matches.filter((m) => m.id !== a.payload);
      })
      .addCase(passProfile.rejected, (s, a) => {
        s.error = a.payload || a.error.message || "Pass failed";
      });
  },
});

export const { clearError, addViewedProfile, removeMatch, setMatches } =
  profileSlice.actions;

export default profileSlice.reducer;
