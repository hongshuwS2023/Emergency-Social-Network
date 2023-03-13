export const getFormattedDate = () => {
  // YYYY-MM-DD HH:MM:SS
  const date = new Date().toISOString();
  return date.split('T')[0] + date.split(',')[1];
};
