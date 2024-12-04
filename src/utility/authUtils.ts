import { toast } from "react-toastify";

export const handleAuthError = (status: number, message?: string) => {
  if ([400, 401, 422, 404, 419, 500, 403].includes(status)) {
    if (message) {
      toast.error(message);
    }
  }
};