
import { useState, useEffect } from "react";
import { AuthContext } from "./auth";

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(
    localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')) : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Error en login:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [userData]);

  const hasRole = (role) => userData?.user?.rol === role;
  const hasPermission = (permission) => userData?.user?.permissions?.includes(permission);

  const logout = () => setUserData(null);

  return (
    <AuthContext.Provider value={{ userData, login, logout, isLoading, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};