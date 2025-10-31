import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../../services/api/axiosInstance';
// Async thunk for fetching pharmacy review details
export const fetchPharmacyReview = createAsyncThunk(
  'pharmacyReview/fetchDetails',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/pharmacists/dispensaries/${reviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'حدث خطأ في جلب تفاصيل المراجعة');
    }
  }
);

const pharmacyReviewSlice = createSlice({
  name: 'pharmacyReview',
  initialState: {
    reviewDetails: null,
    loading: false,
    error: null,
    isModalOpen: false,
  },
  reducers: {
    openReviewModal: (state) => {
      state.isModalOpen = true;
    },
    closeReviewModal: (state) => {
      state.isModalOpen = false;
      state.reviewDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPharmacyReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPharmacyReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDetails = action.payload.data;
        state.isModalOpen = true;
      })
      .addCase(fetchPharmacyReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'حدث خطأ في جلب تفاصيل المراجعة';
      });
  },
});

export const { openReviewModal, closeReviewModal } = pharmacyReviewSlice.actions;
export default pharmacyReviewSlice.reducer;
