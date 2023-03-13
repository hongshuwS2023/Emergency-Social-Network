export const getFormattedDate = () => {
  // YYYY-MM-DD HH:MM:SS
  const date = new Date();
  return date.toISOString().split('T')[0] + date.toLocaleString().split(',')[1];
};
