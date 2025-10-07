import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لتعديل مستخدم
export const updateUser = createAsyncThunk(
  'userEdit/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);

      if (response.data.success) {
        return {
          user: response.data.data,
          message: response.data.message
        };
      } else {
        return rejectWithValue(response.data.message || 'حدث خطأ أثناء تعديل المستخدم');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ في الشبكة أثناء تعديل المستخدم'
      );
    }
  }
);

// Async thunk لحذف مستخدم
export const deleteUser = createAsyncThunk(
  'userEdit/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);

      if (response.data.success) {
        return {
          userId,
          message: response.data.message
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

// Async thunk لجلب مستخدم واحد للتعديل
export const fetchUserById = createAsyncThunk(
  'userEdit/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue('حدث خطأ أثناء جلب بيانات المستخدم');
      }
    } catch (error) {
      return rejectWithValue('حدث خطأ في الشبكة أثناء جلب بيانات المستخدم');
    }
  }
);

const userEditSlice = createSlice({
  name: 'userEdit',
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
    saving: false,
    deleting: false,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSaving: (state, action) => {
      state.saving = action.payload;
    },
    setDeleting: (state, action) => {
      state.deleting = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب مستخدم واحد
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // تعديل مستخدم
      .addCase(updateUser.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.saving = false;
        state.currentUser = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // حذف مستخدم
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleting = false;
        state.currentUser = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentUser,
  setCurrentUser,
  setLoading,
  setError,
  setSaving,
  setDeleting
} = userEditSlice.actions;

export default userEditSlice.reducer;
