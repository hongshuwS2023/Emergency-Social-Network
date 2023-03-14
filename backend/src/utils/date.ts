export const getFormattedDate = (timeStamp: number) => {
  // YYYY-MM-DD HH:MM:SS
  const date = new Date(timeStamp);
  return date.toISOString().split('T')[0] + date.toLocaleString().split(',')[1];
};
