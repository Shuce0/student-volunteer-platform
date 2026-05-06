import api from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        localStorage.removeItem("token");
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch user";
    }
  },

  updateCurrentUser: async (userData) => {
    try {
      const response = await api.put("/auth/me", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update profile";
    }
  },

  getPendingClubs: async () => {
    try {
      const response = await api.get("/auth/pending-clubs");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch pending clubs";
    }
  },

  approveClub: async (id) => {
    try {
      const response = await api.put(`/auth/clubs/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to approve club";
    }
  },
};
