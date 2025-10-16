import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api/dashboardAPI';

// Async thunks for API calls
export const fetchSummaryStats = createAsyncThunk(
  'dashboard/fetchSummaryStats',
  async () => {
    return await dashboardAPI.getSummaryStats();
  }
);

export const fetchTrendsData = createAsyncThunk(
  'dashboard/fetchTrendsData',
  async (period = 'month') => {
    return await dashboardAPI.getTrendsData(period);
  }
);

export const fetchDoctorsStats = createAsyncThunk(
  'dashboard/fetchDoctorsStats',
  async () => {
    return await dashboardAPI.getDoctorsStats();
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    // Summary statistics
    summaryStats: {
      totalAppointments: 0,
      totalPatients: 0,
      totalDoctors: 0,
      totalPharmacies: 0,
      appointmentGrowth: '0%',
      patientGrowth: '0%',
      doctorGrowth: '0%',
      pharmacyGrowth: '0%'
    },
    summaryStatsLoading: false,
    summaryStatsError: null,

    // Trends data
    trendsData: {
      data: []
    },
    trendsLoading: false,
    trendsError: null,

    // Doctors statistics
    doctorsStats: {
      topDoctors: [],
      appointmentStats: {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        scheduledBookings: 0,
        cancellationRate: '0%',
        completionRate: '0%',
        scheduledRate: '0%',
        averageBookingsPerDay: 0,
        averageBookingsPerMonth: 0,
        peakBookingHour: ''
      },
      appointmentStatusData: []
    },
    doctorsStatsLoading: false,
    doctorsStatsError: null,

    // General state
    selectedPeriod: 'month'
  },
  reducers: {
    clearDashboardErrors: (state) => {
      state.summaryStatsError = null;
      state.trendsError = null;
      state.doctorsStatsError = null;
    },
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Summary stats cases
      .addCase(fetchSummaryStats.pending, (state) => {
        state.summaryStatsLoading = true;
        state.summaryStatsError = null;
      })
      .addCase(fetchSummaryStats.fulfilled, (state, action) => {
        state.summaryStatsLoading = false;
        state.summaryStats = action.payload;
      })
      .addCase(fetchSummaryStats.rejected, (state, action) => {
        state.summaryStatsLoading = false;
        state.summaryStatsError = action.error.message;
      })

      // Trends data cases
      .addCase(fetchTrendsData.pending, (state) => {
        state.trendsLoading = true;
        state.trendsError = null;
      })
      .addCase(fetchTrendsData.fulfilled, (state, action) => {
        state.trendsLoading = false;
        state.trendsData = action.payload;
      })
      .addCase(fetchTrendsData.rejected, (state, action) => {
        state.trendsLoading = false;
        state.trendsError = action.error.message;
      })

      // Doctors stats cases
      .addCase(fetchDoctorsStats.pending, (state) => {
        state.doctorsStatsLoading = true;
        state.doctorsStatsError = null;
      })
      .addCase(fetchDoctorsStats.fulfilled, (state, action) => {
        state.doctorsStatsLoading = false;
        state.doctorsStats = action.payload.data;
      })
      .addCase(fetchDoctorsStats.rejected, (state, action) => {
        state.doctorsStatsLoading = false;
        state.doctorsStatsError = action.error.message;
      });
  },
});

export const { clearDashboardErrors, setSelectedPeriod } = dashboardSlice.actions;

export default dashboardSlice.reducer;
