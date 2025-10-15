import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentsAPI } from '../../services/api/appointmentsAPI';

// Async thunks for API calls
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async ({ date, status, page = 1, per_page = 10 } = {}) => {
    return await appointmentsAPI.getAppointments({ date, status, page, per_page });
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    filters: {
      date: '',
      status: '',
      page: 1
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        date: '',
        status: 'all', // تعيين القيمة الافتراضية للحالة إلى 'all'
        page: 1
      };
    },
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
    },
    // Keep existing reducers for local state management if needed
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  addAppointment,
  updateAppointment,
  deleteAppointment
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
