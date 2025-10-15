// Error handling utility for API responses
export const handleApiError = (error) => {
  // Check if error has the specific format with detail in results
  if (error.response?.data?.results?.detail) {
    const detail = error.response.data.results.detail;
    
    // If detail is an array, join the messages
    if (Array.isArray(detail)) {
      return detail.join(', ');
    }
    
    // If detail is a string, return it directly
    return detail;
  }
  
  // Check for standard error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for general error message
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Fallback to generic error message
  return error.message || 'An unexpected error occurred';
};

// Function to show error popup/alert
export const showErrorPopup = (message) => {
  // Using browser alert for now - can be replaced with a custom modal/toast
  alert(message);
};

// Function to handle and display API errors
export const handleAndShowError = (error) => {
  const errorMessage = handleApiError(error);
  showErrorPopup(errorMessage);
  return errorMessage;
};
