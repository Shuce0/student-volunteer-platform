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

  getPendingGoodDeeds: async () => {
    try {
      const response = await api.get("/good-deeds/pending");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data?.message || "Failed to fetch pending good deeds"
      );
    }
  },

  verifyGoodDeed: async (id) => {
    try {
      const response = await api.put(`/good-deeds/${id}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to verify good deed";
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
