import { toast } from "react-toastify";
import { NavigateFunction } from "react-router-dom";

export const handleAuthError = (status: number, navigate: NavigateFunction, message?: string) => {
  if ([400, 401, 422, 404, 419, 500, 403].includes(status)) {
    if (message) {
      toast.error(message);
    }
  }
};