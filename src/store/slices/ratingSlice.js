import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ratingAPI } from '../../services/api/ratingAPI';

// Async thunks for API calls
export const fetchRatingStats = createAsyncThunk(
  'ratings/fetchRatingStats',
  async () => {
    return await ratingAPI.getRatingStats();
  }
);

const ratingSlice = createSlice({
  name: 'ratings',
  initialState: {
    summaryStats: {
      totalDoctors: 0,
      totalReviews: 0,
      globalAverageRating: 0,
      topRatedDoctor: {
        id: null,
        name: '',
        averageRating: 0,
        totalReviews: 0
      }
    },
    doctorsRanking: [],
    loading: false,
    error: null
  },
  reducers: {
    clearRatingError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryStats = action.payload.summaryStats;
        state.doctorsRanking = action.payload.doctorsRanking;
      })
      .addCase(fetchRatingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearRatingError } = ratingSlice.actions;

export default ratingSlice.reducer;
