import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveSession, getSession, clearSession, isExcludedPath } from '../utils/sessionManager';

/**
 * SessionManager Component
 * Manages session restoration and tab closure detection
 */
const SessionManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check for stored session on mount
  useEffect(() => {
    // Don't restore session if we're on an excluded path or already on calendar page
    if (isExcludedPath(location.pathname) || location.pathname === '/') {
      clearSession(); // Clear any stored session
      return;
    }

    const session = getSession();
    
    if (session && session.path) {
      // Check if session is still valid (within 2 minutes)
      const now = Date.now();
      const timeElapsed = now - session.timestamp;
      
      if (timeElapsed <= 2 * 60 * 1000) {
        // Session is valid (within 2 minutes), restore to previous page
        const currentPath = location.pathname + (location.search || '');
        if (session.path !== currentPath) {
          const [path, query] = session.path.split('?');
          navigate(path + (query ? `?${query}` : ''), { replace: true });
        }
        clearSession(); // Clear after restoration
      } else {
        // Session expired (more than 2 minutes), redirect to calendar page
        clearSession();
        navigate('/', { replace: true });
      }
    } else {
      // No session stored, user is on intended page - do nothing
    }
  }, []); // Only run on mount

  // Save current session on route change
  useEffect(() => {
    // Don't save session for excluded paths
    if (isExcludedPath(location.pathname)) {
      clearSession(); // Clear session on excluded paths
      return;
    }

    // If navigating to calendar page (root), clear session as it's the default landing page
    if (location.pathname === '/') {
      clearSession();
      return;
    }

    // Save the current path for other routes
    const searchParams = location.search.replace(/^\?/, ''); // Remove leading '?'
    saveSession(location.pathname, searchParams);
  }, [location.pathname, location.search]);

  // Handle tab closure and visibility change
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Save session before page unloads
      if (!isExcludedPath(location.pathname)) {
        const searchParams = location.search.replace(/^\?/, '');
        saveSession(location.pathname, searchParams);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Tab is being hidden/closed
        if (!isExcludedPath(location.pathname)) {
          const searchParams = location.search.replace(/^\?/, '');
          saveSession(location.pathname, searchParams);
        }
      } else if (document.visibilityState === 'visible') {
        // Tab is visible again - check if session is still valid
        const session = getSession();
        if (session) {
          const now = Date.now();
          const timeElapsed = now - session.timestamp;
          
          // If more than 2 minutes have passed, clear session
          if (timeElapsed > 2 * 60 * 1000) {
            clearSession();
          }
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
};

export default SessionManager;
