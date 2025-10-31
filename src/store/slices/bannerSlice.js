// src/store/slices/bannerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Thunk لجلب البانرات من API
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings/banners');
      if (response.data.success) {
        return response.data.data.home_banner.map((banner) => ({
          id: banner.index.toString(),
          index: banner.index,
          image: banner.image,
          description: banner.description
        }));
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch banners');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk لإضافة بانر جديد
export const addBanner = createAsyncThunk(
  'banners/addBanner',
  async (bannerData, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('description', bannerData.description);

      if (bannerData.image) {
        formData.append('image', bannerData.image);
      }

      const response = await axiosInstance.post('/settings/banners', formData);

      if (response.data.success) {
        dispatch(fetchBanners());
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'فشل في إضافة البانر');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء إضافة البانر'
      );
    }
  }
);

// Async thunk لتعديل بانر موجود
export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Add method spoofing for Laravel
      formData.append('description', bannerData.description);

      if (bannerData.image) {
        // If it's a File object (new image), append it directly
        if (bannerData.image instanceof File) {
          formData.append('image', bannerData.image);
        }
        // If it's a string (existing image URL), don't append it to avoid errors
      }

      const response = await axiosInstance.post(`/settings/banners/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Refresh banners list after successful update
        
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'فشل في تعديل البانر');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء تعديل البانر'
      );
    }
  }
);

// Async thunk لحذف بانر
export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(`/settings/banners/${id}`);

      if (response.data.success) {
        // إعادة جلب البيانات بعد الحذف الناجح
        dispatch(fetchBanners());
        return { id, message: response.data.message };
      } else {
        return rejectWithValue(response.data.message || 'فشل في حذف البانر');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء حذف البانر'
      );
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    banners: [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    clearBannerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearBannerState } = bannerSlice.actions;

export default bannerSlice.reducer;
