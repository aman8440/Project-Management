import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userState } from "../state/UserDataState";
import { UserStateDataTwo } from "../interfaces";

export const useUserData = () => {
  const [userStateData, setUserStateData] = useRecoilState<any>(userState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://b211-2401-4900-1c2b-639e-f6ba-dfec-968c-8652.ngrok-free.app/truck_management/", {
          headers: {
            Authorization: localStorage.getItem("jwtToken"),
          },
        });
        setUserStateData(response?.data?.stateData);
      } catch (error) {
        console.log(error);
        throw new Error("Error in fetching user state data.");
      }
    };
    fetchData();
  }, []);
};