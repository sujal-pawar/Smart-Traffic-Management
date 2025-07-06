/**
 * Application initialization script
 * Sets up the light theme for the application
 */

// Force light theme
export const initializeApp = () => {
  // Remove any existing theme setting
  localStorage.removeItem('darkMode');
  
  // Set light theme
  document.documentElement.removeAttribute('data-theme');
  
  console.log('Application initialized in light mode');
};

export default initializeApp;
