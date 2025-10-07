import { createSlice } from '@reduxjs/toolkit';

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    medications: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMedications: (state, action) => {
      state.medications = action.payload;
    },
    addMedication: (state, action) => {
      state.medications.push(action.payload);
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setMedications, addMedication, setOrders, addOrder, setLoading, setError } = pharmacySlice.actions;
export default pharmacySlice.reducer;
