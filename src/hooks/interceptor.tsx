import { getToken } from "../services/storage.service";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { handleAuthError } from "../utility/authUtils";

const Interceptor = ({ children }: { children: React.ReactNode }) => {

  useEffect(() => {
    apiInterceptor();
  }, []);

  const apiInterceptor = () => {
    const originalFetch = window.fetch;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.fetch = async (input: any, init = {}): Promise<Response> => {
      const token = getToken();

      const isAWSUrl =
        (typeof input === "string") ||
        (typeof input === "object");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers: any = {
        ...init.headers,
        Accept: "application/json",
      };

      if (!isAWSUrl) {
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
      }
      init.headers = headers;

      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const res = await originalFetch(input as Request, init);
          const contentType = res.headers.get("Content-Type");
          const responseData = contentType && contentType.includes("application/json") ? res : null;
          
          if (!res.ok) {
            handleAuthError(res.status, res.statusText);
            return reject(responseData || { status: res.status, message: res.statusText });
          } 
          return resolve(res);
        } catch (error) {
          toast.error("Network error. Please check your connection.");
          return reject(error);
        }
      });
    };
  };

  return (
    <>
      {children}
    </>
  );
};

export default Interceptor;
