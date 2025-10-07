import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لطلب تسجيل الدخول من الباك إند
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });

      // تخزين التوكن في localStorage
      localStorage.setItem('token', response.data.token);

      return {
        token: response.data.token,
        account_type: response.data.account_type,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    account_type: null,
    loading: false,
    error: null,
    message: null, // أضفنا الرسالة هنا
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.account_type = null;
      state.message = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.account_type = action.payload.account_type;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
