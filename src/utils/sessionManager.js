/**
 * Session Manager Utility
 * Handles tab closure detection and session restoration
 * Users have 2 minutes to reopen the tab and return to their previous page
 */

const SESSION_KEY = 'trms_session';
const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds

/**
 * Store the current session (route and timestamp)
 */
export const saveSession = (pathname, searchParams = '') => {
  try {
    const sessionData = {
      path: pathname + (searchParams ? `?${searchParams}` : ''),
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

/**
 * Get the stored session if it exists and is still valid (within 2 minutes)
 */
export const getSession = () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);
    const now = Date.now();
    const timeElapsed = now - session.timestamp;

    // If session is older than 2 minutes, it's expired
    if (timeElapsed > SESSION_TIMEOUT) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    clearSession();
    return null;
  }
};

/**
 * Clear the stored session
 */
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * Check if a path should be excluded from session management
 * (e.g., login, unauthorized pages)
 */
export const isExcludedPath = (pathname) => {
  const excludedPaths = ['/login', '/unauthorized'];
  return excludedPaths.includes(pathname);
};
