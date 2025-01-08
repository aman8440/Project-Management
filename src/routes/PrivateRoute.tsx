import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAppDispatch } from "../hooks/authHook";
import { fetchProfile } from "../features/auth/authSlice";
import { useEffect } from "react";
import { getToken } from "../services/storage.service";



export const PrivateRoutes= () => {
  const token = getToken();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useNavigate();

  useEffect(() => {
    if (!token) {
      router("/login");
      return;
    }
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch, router]);
  return  <Outlet />;
};