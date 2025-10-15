import axiosInstance from './axiosInstance';

export const ratingAPI = {
  // Get rating statistics
  getRatingStats: async () => {
    const response = await axiosInstance.get('/rating/stats');
    return response.data;
  }
};
