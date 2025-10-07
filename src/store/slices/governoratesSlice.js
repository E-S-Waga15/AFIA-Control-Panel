import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// البيانات الثابتة كـ fallback
const staticGovernorates = [
  { id: 1, nameEn: "Damascus", nameAr: "دمشق" },
  { id: 2, nameEn: "Rural Damascus", nameAr: "ريف دمشق" },
  { id: 3, nameEn: "Aleppo", nameAr: "حلب" },
  { id: 4, nameEn: "Homs", nameAr: "حمص" },
  { id: 5, nameEn: "Hama", nameAr: "حماة" },
  { id: 6, nameEn: "Latakia", nameAr: "اللاذقية" },
  { id: 7, nameEn: "Tartus", nameAr: "طرطوس" },
  { id: 8, nameEn: "Deir ez-Zor", nameAr: "دير الزور" },
  { id: 9, nameEn: "Raqqa", nameAr: "الرقة" },
  { id: 10, nameEn: "As-Suwayda", nameAr: "السويداء" },
  { id: 11, nameEn: "Daraa", nameAr: "درعا" },
  { id: 12, nameEn: "Quneitra", nameAr: "القنيطرة" },
  { id: 13, nameEn: "Idlib", nameAr: "إدلب" },
  { id: 14, nameEn: "Al-Hasakah", nameAr: "الحسكة" }
];

// Async thunk لجلب المحافظات من API
export const fetchGovernorates = createAsyncThunk(
  'governorates/fetchGovernorates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/governorates');
      if (response.data.success) {
        return response.data.data;
      } else {
        // في حالة فشل API، نستخدم البيانات الثابتة
        return staticGovernorates;
      }
    } catch (error) {
      // في حالة خطأ في الشبكة، نستخدم البيانات الثابتة
      return staticGovernorates;
    }
  }
);

const initialState = {
  governorates: staticGovernorates,
  loading: false,
  error: null,
};

const governoratesSlice = createSlice({
  name: 'governorates',
  initialState,
  reducers: {
    clearGovernoratesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGovernorates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGovernorates.fulfilled, (state, action) => {
        state.loading = false;
        state.governorates = action.payload;
        state.error = null;
      })
      .addCase(fetchGovernorates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'حدث خطأ أثناء جلب المحافظات';
        // نستخدم البيانات الثابتة في حالة الخطأ
        state.governorates = staticGovernorates;
      });
  },
});

export const { clearGovernoratesError } = governoratesSlice.actions;
export default governoratesSlice.reducer;
