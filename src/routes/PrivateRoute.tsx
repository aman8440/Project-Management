import Dashboard from "../pages/private_layout/Dashboard";
import ProjectList from "../pages/private_layout/ProjectList"
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/storageService";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextTypeData, AuthProviderProps } from "../interfaces";

const AuthContext = createContext<AuthContextTypeData>({user: null});
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextTypeData>({user: null});

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getToken();
      if (!token) {
        setAuthState({ user: null});
        return;
      }
      try {
        const response = await fetch("http://localhost/truck_management/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAuthState({user: data.admin});
        } else {
          setAuthState({ user: null});
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setAuthState({ user: null});
      }
    };

    fetchUserProfile();
  }, []);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const PrivateRoutes: React.FC= () => {
  return getToken() ? <Outlet /> : <Navigate to="/login" />;
};

export const PrivateRoute = [
  {
    path: "/dashboard",
    element: (
      <Dashboard />
    ),
  },
  {
    path: "/projects",
    element: (
      <ProjectList />
    ),
  },
];