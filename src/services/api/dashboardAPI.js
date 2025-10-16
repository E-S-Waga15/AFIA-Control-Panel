import axiosInstance from './axiosInstance';

export const dashboardAPI = {
  // Get dashboard summary statistics
  getSummaryStats: async () => {
    const response = await axiosInstance.get('/dashboard/summary-stats');
    return response.data;
  },

  // Get dashboard trends data
  getTrendsData: async (period = 'month') => {
    const response = await axiosInstance.get(`/dashboard/trends?period=${period}`);
    return response.data;
  },

  // Get doctors statistics
  getDoctorsStats: async () => {
    const response = await axiosInstance.get('/doctors/stats');
    return response.data;
  }
};
