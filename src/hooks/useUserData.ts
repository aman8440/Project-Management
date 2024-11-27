import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../state/UserDataState";
import { getToken } from "../services/storageService";
import { AuthContextTypeData } from "../interfaces";

export const useUserData = () => {
  const [userStateData, setUserStateData] = useRecoilState<AuthContextTypeData>(userState);
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/truck_management/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        }
        const data = await response.json();
        setUserStateData(data.admin);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) fetchData();
  }, [token]);

  return userStateData;
};
