import { getToken } from "../services/storage.service";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { handleAuthError } from "../utility/authUtils";

const Interceptor = ({ children }: { children: React.ReactNode }) => {
  const isInterceptorSet = useRef(false);

  const apiInterceptor = () => {
    if (isInterceptorSet.current) return;

    isInterceptorSet.current = true;
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      const token = getToken();

      const isLocalUrl = typeof input === 'string' && input.startsWith('http://localhost:5173');
      const headers: Record<string, string> = {};

      if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            headers[key] = value;
          }
        });
      }
      headers['Accept'] = 'application/json';

      if (!isLocalUrl) {
        const isFormData = init.body instanceof FormData;
        const isJsonBody = init.body && 
          typeof init.body === 'string' && 
          (init.body.startsWith('{') || init.body.startsWith('['));

        if (isFormData) {
          headers["Authorization"] = `Bearer ${token}`;
        } else if (isJsonBody || init.body instanceof Blob) {
          headers["Content-Type"] = "application/json";
          headers["Authorization"] = `Bearer ${token}`;
          
          if (isJsonBody) {
            try {
              JSON.parse(init.body as string);
            } catch {
              init.body = JSON.stringify(JSON.parse(init.body as string));
            }
          }
        }
      }
      const modifiedInit: RequestInit = {
        ...init,
        headers: headers
      };
      try {
        const res = await originalFetch(input, modifiedInit);
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