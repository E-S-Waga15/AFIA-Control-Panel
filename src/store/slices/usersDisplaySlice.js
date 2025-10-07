import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Async thunk لجلب المستخدمين من API حسب نوع الحساب
export const fetchUsers = createAsyncThunk(
  'usersDisplay/fetchUsers',
  async (accountType = 'doctor', { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users-profile/${accountType}`);
      // بناءً على الـ API response المقدم، البيانات تكون مباشرة في response.data
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return rejectWithValue('البيانات المستلمة ليست في الصيغة المتوقعة');
      }
    } catch (error) {
      return rejectWithValue('حدث خطأ في الشبكة أثناء جلب المستخدمين');
    }
  }
);

// Async thunk لتحديث حالة المستخدم (تفعيل/إلغاء تفعيل)
export const updateUserStatus = createAsyncThunk(
  'usersDisplay/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/status`, { status });
      if (response.data.success) {
        return { userId, status: response.data.data.accountStatus };
      } else {
        return rejectWithValue('حدث خطأ أثناء تحديث حالة المستخدم');
      }
    } catch (error) {
      return rejectWithValue('حدث خطأ في الشبكة أثناء تحديث حالة المستخدم');
    }
  }
);

const usersDisplaySlice = createSlice({
  name: 'usersDisplay',
  initialState: {
    users: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    totalUsers: 0,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUserInList: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    removeUserFromList: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPagination: (state, action) => {
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalUsers = action.payload.totalUsers;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب المستخدمين
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
      })
      // تحديث حالة المستخدم
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, status } = action.payload;
        const userIndex = state.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].accountStatus = status;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUsers,
  updateUserInList,
  removeUserFromList,
  setLoading,
  setError,
  setPagination
} = usersDisplaySlice.actions;

export default usersDisplaySlice.reducer;
