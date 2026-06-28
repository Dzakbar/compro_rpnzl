import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const userDataStr = localStorage.getItem('rpnzl_user_data');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('rpnzl_user_data');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('rpnzl_user_login');
    localStorage.removeItem('rpnzl_user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
  };
}

