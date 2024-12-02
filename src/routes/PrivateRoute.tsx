import { Outlet, useNavigate } from "react-router-dom";
import { getToken } from "../services/storage.service";
import { useUserProfile } from "../hooks/userProfile";
import { useEffect } from "react";

export const PrivateRoutes = () => {
  const router = useNavigate();
  const { fetchUserProfile, userProfile } = useUserProfile();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router("/login");
      return;
    }
    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return null;
  }
  return <Outlet />;
};