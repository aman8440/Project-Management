import { getToken } from "../services/storageService";

export const useAuth = (setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>) => {

  const jwtToken = getToken();
  if (!jwtToken || jwtToken === "") {
    setAuthenticated(false);
    return false;
  }

  async function validateToken(jwtToken : string) {
    try {
      const response = await fetch("http://localhost/truck_management/auth/validate" ,{
        method: "POST",
       body:JSON.stringify({token: jwtToken})});
      if (response.status === 200) {
        console.log("Token is valid");
        setAuthenticated(true);
      } else {
        console.log("Token is invalid");
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setAuthenticated(false);
    }
  }

  validateToken(jwtToken);
};
