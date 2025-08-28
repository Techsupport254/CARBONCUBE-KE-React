// utils/formatDate.js
export const formatDate = (dateString) => {
  if (!dateString) return ''; // Return an empty string for invalid or missing date
  const date = new Date(dateString);
  
  // Ensure the date is formatted as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for month
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for day

  return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
};
