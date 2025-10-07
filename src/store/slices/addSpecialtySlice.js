import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';
import { fetchSpecialties } from './specialtiesSlice';
// Async thunk لإضافة اختصاص جديد
export const addSpecialty = createAsyncThunk(
  'addSpecialty/addSpecialty',
  async (specialtyData, { rejectWithValue , dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('name', specialtyData.name);
      formData.append('description', specialtyData.description);
      formData.append('color', specialtyData.color);

      if (specialtyData.image) {
        formData.append('image', specialtyData.image);
      }

      const response = await axiosInstance.post('/admin/specialization/upload-image', formData, {
      
      });

      if (response.data.success) {
         dispatch(fetchSpecialties());
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'فشل في إضافة الاختصاص');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء إضافة الاختصاص'
      );
    }
  }
);

// Async thunk لتعديل اختصاص موجود
export const updateSpecialty = createAsyncThunk(
  'addSpecialty/updateSpecialty',
  async ({ id, specialtyData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', specialtyData.name);
      formData.append('description', specialtyData.description);
      formData.append('color', specialtyData.color);

      if (specialtyData.image) {
        formData.append('image', specialtyData.image);
      }

      const response = await axiosInstance.put(`/admin/specialization/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'فشل في تعديل الاختصاص');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'حدث خطأ أثناء تعديل الاختصاص'
      );
    }
  }
);

const addSpecialtySlice = createSlice({
  name: 'addSpecialty',
  initialState: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    clearAddSpecialtyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSpecialty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(addSpecialty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(addSpecialty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateSpecialty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateSpecialty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(updateSpecialty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearAddSpecialtyState } = addSpecialtySlice.actions;
export default addSpecialtySlice.reducer;
