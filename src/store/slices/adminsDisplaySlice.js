import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لجلب قائمة الإدمن
export const fetchAdmins = createAsyncThunk(
  'adminsDisplay/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admins');

      if (response.data.success) {
        return {
          success: true,
          admins: response.data.data || [],
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء جلب الإدمن');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء جلب الإدمن'
      );
    }
  }
);

// Async thunk لجلب إدمن واحد بالـ ID
export const fetchAdminById = createAsyncThunk(
  'adminsDisplay/fetchAdminById',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admins/${adminId}`);

      if (response.data.success) {
        return {
          success: true,
          admin: response.data.data,
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء جلب الإدمن');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء جلب الإدمن'
      );
    }
  }
);

const adminsDisplaySlice = createSlice({
  name: 'adminsDisplay',
  initialState: {
    admins: [], // قائمة الإدمن
    currentAdmin: null, // الإدمن المحدد حالياً
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearAdmins: (state) => {
      state.admins = [];
      state.success = false;
    },
    clearCurrentAdmin: (state) => {
      state.currentAdmin = null;
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
      // جلب قائمة الإدمن
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.admins || [];
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'حدث خطأ غير متوقع أثناء جلب الإدمن';
        state.success = false;
        state.admins = [];
      })
      // جلب إدمن واحد
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.admin;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'حدث خطأ غير متوقع أثناء جلب الإدمن';
        state.success = false;
        state.currentAdmin = null;
      });
  },
});

export const {
  clearAdmins,
  clearCurrentAdmin,
  setLoading,
  setError,
  setSuccess
} = adminsDisplaySlice.actions;

export default adminsDisplaySlice.reducer;