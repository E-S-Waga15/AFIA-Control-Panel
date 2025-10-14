import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لجلب معلومات المستخدم بواسطة الـ ID
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/profile/${userId}`);

      if (response.data.success === true) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        return rejectWithValue({
          success: false,
          message: response.data.message || 'حدث خطأ أثناء جلب معلومات المستخدم',
          data: null
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || 'حدث خطأ في الشبكة أثناء جلب معلومات المستخدم',
        data: null
      });
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    userProfile: null, // بيانات المستخدم الكاملة
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearUserProfile: (state) => {
      state.userProfile = null;
      state.success = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.success = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.data;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'حدث خطأ غير متوقع';
        state.success = false;
        state.userProfile = null;
      });
  },
});

export const { clearUserProfile, setLoading, setError, setSuccess } = userProfileSlice.actions;
export default userProfileSlice.reducer;
