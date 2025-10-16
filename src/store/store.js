import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import userProfileReducer from './slices/userProfileSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import authReducer from './slices/authSlice';
import specialtiesReducer from './slices/specialtiesSlice';
import addSpecialtyReducer from './slices/addSpecialtySlice';
import deleteSpecialtyReducer from './slices/deleteSpecialtySlice';
import governoratesReducer from './slices/governoratesSlice.js';
import usersDisplayReducer from './slices/usersDisplaySlice';
import ratingReducer from './slices/ratingSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        userProfile: userProfileReducer,
        appointments: appointmentsReducer,
        auth: authReducer,
        specialties: specialtiesReducer,
        addSpecialty: addSpecialtyReducer,
        deleteSpecialty: deleteSpecialtyReducer,
        usersDisplay: usersDisplayReducer,
        governorates: governoratesReducer,
        ratings: ratingReducer,
        dashboard: dashboardReducer,
    },
});

export default store;