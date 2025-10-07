// src/store/slices/specialtiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// Thunk لجلب الاختصاصات من API
export const fetchSpecialties = createAsyncThunk(
  'specialties/fetchSpecialties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/getAllSpecializations');
      if (response.data.success) {
        // تعيين اللون الافتراضي purple إذا رجع null
        return response.data.data.map((item) => ({
          id: item.id.toString(), // التأكد من أن الـ ID يكون string دائماً
          name: item.name,
          description: item.description || '',
          iconUrl: item.iconUrl,
          color: item.color || 'purple',
        }));
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const specialtiesSlice = createSlice({
  name: 'specialties',
  initialState: {
    specialties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties = action.payload;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default specialtiesSlice.reducer;
