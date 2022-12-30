import { Loader } from "@mantine/core";
import React, { useState, useEffect, useContext } from "react";
import Login from "../pages/auth/Login";
import { getLoggedInUser, login as loginApi, logout as logoutApi, User } from "../services/api";

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: ({ username, password }: { username: string; password: string }) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: ({ username, password }: { username: string; password: string }) => {},
  logout: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { status, ...user } = await getLoggedInUser();
      if (status === 200) {
        setAuthenticated(true);
        setUser(user);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async ({ username, password }: { username: string; password: string }) => {
    const { status, ...user } = await loginApi(username, password);
    if (status === 200) {
      setAuthenticated(true);
      setUser(user);
    }
  };

  const logout = () => {
    logoutApi();
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

type AuthWrapperProps = {
  children: React.ReactNode;
};

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { loading, isAuthenticated } = useContext(AuthContext);
  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Login />;
  }
  return <>{children}</>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
