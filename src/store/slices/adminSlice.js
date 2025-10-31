import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لإنشاء إدمن جديد
const registerAdmin = createAsyncThunk(
  'admin/registerAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admins', adminData);

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
          message: response.data.message || 'حدث خطأ أثناء إنشاء الإدمن',
          data: response.data.data || null
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || 'حدث خطأ في الشبكة أثناء إنشاء الإدمن',
        data: error.response?.data?.data || null
      });
    }
  }
);

// Async thunk لتعديل إدمن
const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ adminId, adminData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admins/${adminId}`, adminData);

      if (response.data.success) {
        return {
          success: true,
          admin: response.data.data,
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء تعديل الإدمن');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء تعديل الإدمن'
      );
    }
  }
);

// Async thunk لحذف إدمن
const deleteAdminAPI = createAsyncThunk(
  'admin/deleteAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${adminId}`);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          adminId: adminId
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء حذف الإدمن');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء حذف الإدمن'
      );
    }
  }
);

// Async thunk لتغيير حالة الإدمن
const toggleAdminStatusAPI = createAsyncThunk(
  'admin/toggleAdminStatus',
  async ({ adminId, currentStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/users/${adminId}/block`);

      if (response.data.success) {
        return {
          admin: response.data.data,
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء تغيير حالة الإدمن');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء تغيير حالة الإدمن'
      );
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    currentAdmin: null, // الإدمن الذي تم إنشاؤه حديثاً
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
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
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.data;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'حدث خطأ غير متوقع';
        state.success = false;
        state.currentAdmin = null;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteAdminAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteAdminAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(toggleAdminStatusAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAdminStatusAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(toggleAdminStatusAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCurrentAdmin, setLoading, setError, setSuccess } = adminSlice.actions;
export { registerAdmin, updateAdmin, deleteAdminAPI, toggleAdminStatusAPI };
export default adminSlice.reducer;