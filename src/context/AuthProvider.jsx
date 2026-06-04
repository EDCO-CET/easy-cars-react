
import { useState, useEffect } from "react";
import { AuthContext } from "./auth";
import { supabase } from "../utils/supabase";

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState (null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else if (session?.user) {
        setUserData({
          email: session.user.email,
          name: session.user.email,
          role: 'Admin',
        });
      }
      setIsLoading(false);
    };

    getInitialSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if(error){
        throw error;
      }
      const userData = {
        email: data.user.email,
        name: data.user.email,
        role: 'Admin',
      }
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

  const hasRole = (role) => userData?.role === role;
  const hasPermission = (permission) => userData?.user?.permissions?.includes(permission);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error en logout:', error);
    }
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ userData, login, logout, isLoading, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};