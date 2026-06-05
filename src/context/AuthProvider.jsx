
import { useState, useEffect } from "react";
import { AuthContext } from "./auth";
import { supabase } from "../utils/supabase";

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      if (session) {
        setUserData({
          id: session.user.id,
          email: session.user.email,
          name: session.user.email.split('@')[0],
          role: 'admin',
          permissions: []
        });
      }
    };

    getInitialSession();
  }, []);


  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const {data, error} = await supabase.auth.signInWithPassword({ email, password });
      if(error){
        throw error;
      }
      const userFromSupabase = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split('@')[0],
        role: 'admin',
        permissions: []
      }
      setUserData(userFromSupabase);
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role) => userData?.role === role;
  const hasPermission = (permission) => userData?.permissions?.includes(permission);

  const logout = () => setUserData(null);

  return (
    <AuthContext.Provider value={{ userData, login, logout, isLoading, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};