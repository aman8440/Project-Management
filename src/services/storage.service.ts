export const getToken= ()=>{
  return localStorage.getItem("token");
}

export const setAuthToken = (token: string | null | undefined): void => {
  try {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.error("Failed to update localStorage:", error);
  }
};
