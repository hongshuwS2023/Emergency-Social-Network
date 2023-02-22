export function getFormattedDate() {
  // YYYY-MM-DD HH:MM:SS
  return (
    new Date().toISOString().split('T')[0] +
    new Date().toLocaleString().split(',')[1]
  );
}
