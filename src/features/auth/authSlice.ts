import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken, setAuthToken } from '../../services/storage.service';
import { AuthenticationService } from '../../swagger/api';
import { UserData } from '../../interfaces';

interface AuthState {
  token: string | null;
  user: UserData | null;
}

const initialState: AuthState = {
  token: getToken() || null,
  user: null,
};

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthenticationService.getMe();
      return response.admin;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      setAuthToken("");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.token = null;
        state.user = null;
        setAuthToken("");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;