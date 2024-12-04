import { toast } from "react-toastify";

export const handleAuthError = (status: number, message?: string) => {
  switch (status) {
    case 401:
      toast.error("Unauthorized access. Please log in again.");
      break;
    case 403:
      toast.error("Access forbidden. You don't have permission.");
      break;
    case 404:
      toast.error("Resource not found.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    case 419:
      toast.error(message || "Session expired. Please log in again.");
      break;
    default:
      toast.error(message || "An unexpected error occurred.");
  }
};