import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';
import { fetchSpecialties } from './specialtiesSlice';

// Async thunk لحذف اختصاص
export const deleteSpecialty = createAsyncThunk(
  'deleteSpecialty/deleteSpecialty',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(`/specializations/${id}`);

      if (response.data.success) {
        // إعادة جلب البيانات بعد الحذف الناجح
        dispatch(fetchSpecialties());
        return { id, message: response.data.message };
      } else {
        return rejectWithValue(response.data.message || 'فشل في حذف الاختصاص');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء حذف الاختصاص'
      );
    }
  }
);

const deleteSpecialtySlice = createSlice({
  name: 'deleteSpecialty',
  initialState: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    clearDeleteSpecialtyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSpecialty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteSpecialty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(deleteSpecialty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearDeleteSpecialtyState } = deleteSpecialtySlice.actions;
export default deleteSpecialtySlice.reducer;
