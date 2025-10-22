import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import userProfileReducer from './slices/userProfileSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import authReducer from './slices/authSlice';
import specialtiesReducer from './slices/specialtiesSlice';
import addSpecialtyReducer from './slices/addSpecialtySlice';
import deleteSpecialtyReducer from './slices/deleteSpecialtySlice';
import bannerReducer from './slices/bannerSlice';
import governoratesReducer from './slices/governoratesSlice.js';
import usersDisplayReducer from './slices/usersDisplaySlice';
import ratingReducer from './slices/ratingSlice';
import dashboardReducer from './slices/dashboardSlice';
import userEditReducer from './slices/userEditSlice';
import adminReducer from './slices/adminSlice';
import adminsDisplayReducer from './slices/adminsDisplaySlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        userProfile: userProfileReducer,
        appointments: appointmentsReducer,
        auth: authReducer,
        specialties: specialtiesReducer,
        addSpecialty: addSpecialtyReducer,
        deleteSpecialty: deleteSpecialtyReducer,
        banners: bannerReducer,
        usersDisplay: usersDisplayReducer,
        userEdit: userEditReducer,
        governorates: governoratesReducer,
        ratings: ratingReducer,
        dashboard: dashboardReducer,
        admin: adminReducer,
        adminsDisplay: adminsDisplayReducer,
    },
});

export default store;