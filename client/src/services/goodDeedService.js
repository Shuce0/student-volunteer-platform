import api from "./api";

export const goodDeedService = {
  getAllGoodDeeds: async () => {
    try {
      const response = await api.get("/good-deeds");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch good deeds";
    }
  },

  createGoodDeed: async (goodDeedData) => {
    try {
      const response = await api.post("/good-deeds", goodDeedData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to create good deed";
    }
  },

  getUserGoodDeeds: async (userId) => {
    try {
      const response = await api.get(`/good-deeds/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch user good deeds";
    }
  },
};
