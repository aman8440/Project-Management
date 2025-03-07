import { setAuthToken } from "../services/storage.service";
import { createContext, useContext, useState, useCallback } from "react";
import { AuthProviderProps, UserData } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthenticationService } from "../swagger/api";

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

  const fetchUserProfile = useCallback(async (): Promise<boolean> => {
    setIsProfileLoading(true);
    try {
      const response = await AuthenticationService.getMe()
      setUserProfile(response.admin);
      return true;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return false;
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLogout = () => {
  const { setUserProfile } = useUserProfile();
  const navigate = useNavigate();
  return () => {
    setUserProfile(undefined);
    setAuthToken("");
    toast.success("Logout successful!");
    navigate("/login");
  };
};