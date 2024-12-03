import { getToken, setAuthToken } from "../services/storage.service";
import { createContext, useContext, useState, useCallback } from "react";
import { AuthProviderProps, UserData } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type UserProfileContextType = {
  userProfile?: UserData;
  setUserProfile: (profile: UserData | undefined) => void;
  fetchUserProfile: () => Promise<boolean>;
  isProfileLoading: boolean;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

export const UserProfileProvider = ({ children }: AuthProviderProps) => {
  const [userProfile, setUserProfile] = useState<UserData>();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    setIsProfileLoading(true);
    try {
      const response = await fetch("http://localhost/truck_management/me", {
        method: "GET",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch user profile");
        return false;
      }

      const data = await response.json();
      setUserProfile(data.admin);
      return true;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Network error. Please try again.");
      return false;
    } finally {
      setIsProfileLoading(false);
    }
  }, [navigate]);

  return (
    <UserProfileContext.Provider value={{ 
      userProfile, 
      setUserProfile, 
      fetchUserProfile, 
      isProfileLoading 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

export const useLogout = () => {
  const { setUserProfile } = useUserProfile();
  const navigate = useNavigate();

  return () => {
    setUserProfile(undefined);
    setAuthToken("");
    navigate("/login");
  };
};