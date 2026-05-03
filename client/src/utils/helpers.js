// Placeholder for additional utility functions
// Add helper functions here

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};
