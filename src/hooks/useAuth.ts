export const useAuth = (setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>) => {
  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken || jwtToken === "" || !jwtToken.startsWith("Bearer")) {
    return false;
  }

  function decodeJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  function validateToken(jwtToken: string) {
    try {
      const decodedToken = decodeJwt(jwtToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      setAuthenticated(false);
      console.log(error)
    }
  }
  const token = jwtToken.split(" ")[1];
  validateToken(token);
};