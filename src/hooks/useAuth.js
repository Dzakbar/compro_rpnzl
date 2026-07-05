import { useCallback, useEffect, useState } from 'react';

export const AUTH_CHANGE_EVENT = 'rpnzl-auth-change';

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function readStoredUser() {
  const userDataStr = localStorage.getItem('rpnzl_user_data');

  if (!userDataStr) {
    return null;
  }

  try {
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('rpnzl_user_login');
    localStorage.removeItem('rpnzl_user_data');
    return null;
  }
}

function getInitialAuthState() {
  const userData = readStoredUser();

  return {
    user: userData,
    isAuthenticated: Boolean(userData),
  };
}

export function useAuth() {
  const [{ user, isAuthenticated }, setAuthState] = useState(getInitialAuthState);
  const loading = false;

  const syncAuthState = useCallback(() => {
    const userData = readStoredUser();

    setAuthState({
      user: userData,
      isAuthenticated: Boolean(userData),
    });
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuthState);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, [syncAuthState]);

  const logout = () => {
    localStorage.removeItem('rpnzl_user_login');
    localStorage.removeItem('rpnzl_user_data');
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    notifyAuthChanged();
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
  };
}
