import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لتسجيل مستخدم جديد فقط
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue ,dispatch }) => {
    try {
      const response = await axiosInstance.post('/register', userData);

      if (response.data.success) {
        return {
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء إنشاء المستخدم');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء إنشاء المستخدم'
      );
    }
  }
);

// Async thunk لتغيير حالة المستخدم
export const toggleUserStatusAPI = createAsyncThunk(
  'user/toggleUserStatus',
  async ({ userId, currentStatus }, { rejectWithValue }) => {
    try {
      // تحديد نوع العملية بناءً على الحالة الحالية
    

      const response = await axiosInstance.post(`/users/${userId}/block`);

      if (response.data.success) {
        return {
          user: response.data.data,
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء تغيير حالة المستخدم');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء تغيير حالة المستخدم'
      );
    }
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null, // المستخدم الذي تم إنشاؤه حديثاً
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.success = false;
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.currentUser = null;
      })
      .addCase(toggleUserStatusAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatusAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(toggleUserStatusAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCurrentUser, setLoading, setError, setSuccess } = userSlice.actions;
export default userSlice.reducer;
