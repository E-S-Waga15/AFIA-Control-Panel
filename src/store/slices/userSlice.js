import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لتسجيل مستخدم جديد فقط
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue ,dispatch }) => {
    try {
      const response = await axiosInstance.post('/register', userData);

      // إعادة كامل الـ response للتحقق من success في المكون
      if (response.data.success === true) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data || null
        };
      } else {
        return rejectWithValue({
          success: false,
          message: response.data.message || 'حدث خطأ أثناء إنشاء المستخدم',
          data: response.data.data || null
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || 'حدث خطأ في الشبكة أثناء إنشاء المستخدم',
        data: error.response?.data?.data || null
      });
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

// Async thunk لحذف مستخدم
export const deleteUserAPI = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          userId: userId
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء حذف المستخدم');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء حذف المستخدم'
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
        state.currentUser = action.payload.data;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'حدث خطأ غير متوقع';
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
      .addCase(deleteUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCurrentUser, setLoading, setError, setSuccess } = userSlice.actions;
export default userSlice.reducer;
