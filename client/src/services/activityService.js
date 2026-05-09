import api from "./api";

export const activityService = {
  getAllActivities: async () => {
    try {
      const response = await api.get("/activities");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch activities";
    }
  },

  getActivityById: async (id) => {
    try {
      const response = await api.get(`/activities/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch activity";
    }
  },

  getClubActivitiesById: async (clubId) => {
    try {
      const response = await api.get(`/activities/club/${clubId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch club activities";
    }
  },

  createActivity: async (activityData) => {
    try {
      const response = await api.post("/activities", activityData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to create activity";
    }
  },

  registerForActivity: async (activityId) => {
    try {
      const response = await api.post(`/activities/${activityId}/register`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to register for activity";
    }
  },

  cancelRegistrationForActivity: async (activityId) => {
    try {
      const response = await api.delete(`/activities/${activityId}/register`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data?.message ||
        "Failed to cancel registration for activity"
      );
    }
  },

  getPendingRegistrations: async () => {
    try {
      const response = await api.get("/activities/registrations/pending");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data?.message || "Failed to fetch pending registrations"
      );
    }
  },

  approveRegistration: async (registrationId) => {
    try {
      const response = await api.post(
        `/activities/registrations/${registrationId}/approve`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to approve registration";
    }
  },

  getUserRegistrations: async (status = "approved") => {
    try {
      const response = await api.get(`/activities/registrations?status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch user registrations";
    }
  },
};
