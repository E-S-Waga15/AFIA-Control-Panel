import axiosInstance from './axiosInstance';

export const appointmentsAPI = {
  // Get filtered appointments with pagination
  getAppointments: async ({ date, status, page = 1, per_page = 10 } = {}) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('per_page', per_page);

    const response = await axiosInstance.get(`/filter/appointments?${params}`);
    return response.data;
  },

  // Get appointment by ID (if needed for details)
  getAppointmentById: async (id) => {
    const response = await axiosInstance.get(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await axiosInstance.delete(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }
};
