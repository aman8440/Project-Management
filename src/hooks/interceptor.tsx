import { getToken } from "../services/storage.service";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { handleAuthError } from "../utility/authUtils";

const Interceptor = ({ children }: { children: React.ReactNode }) => {
  const isInterceptorSet = useRef(false);

  const apiInterceptor = () => {
    if (isInterceptorSet.current) return; // Ensure the interceptor is applied only once

    isInterceptorSet.current = true;
    const originalFetch = window.fetch;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.fetch = async (input: any, init: RequestInit = {}): Promise<Response> => {
      const token = getToken();

      const isAWSUrl =
        typeof input === "string" &&
        (input.startsWith("http://aws") || input.startsWith("https://aws"));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers:any = {
        ...init.headers,
        Accept: "application/json",
      };

      if (!isAWSUrl) {
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
      }

      init.headers = headers;

      try {
        const res = await originalFetch(input, init);
        if (!res.ok) {
          handleAuthError(res.status, res.statusText);
        }
        return res;
      } catch (error) {
        toast.error("Network error. Please check your connection.");
        throw error;
      }
    };
  };

  useEffect(() => {
    apiInterceptor();
  }, []);

  return <>{children}</>;
};

export default Interceptor;
