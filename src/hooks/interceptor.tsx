import ErrorModal from "../components/model/page";
import { getToken, setAuthToken } from "../services/storage.service";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Interceptor = ({ children }: { children: React.ReactNode }) => {
  const router = useNavigate();
  const [errorModalIsOpen, setErrorModalIsOpen] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");

  useEffect(() => {
    apiInterceptor();
  }, []);

  const apiInterceptor = () => {
    const originalFetch = window.fetch;

    window.fetch = async (input: any, init = {}): Promise<Response> => {
      const token = getToken();
      const isAWSUrl =
        (typeof input === "string") ||
        (typeof input === "object");
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
          if ([400, 401, 422, 404, 419, 500, 403].includes(res.status)) {
            const response = await res.json();
            if (res.status === 401 || res.status === 403 || res.status === 404) {
              setAuthToken("");
              router("/login");
            }
            if (res.status === 419) {
              setErrorModalMessage(response?.error?.message);
              setErrorModalIsOpen(true);
            } else {
              toast.error(response?.error?.message);
            }
            return reject(
              response.error || {
                statusCode: 500,
                message: "Something went wrong.",
              },
            );
          }

          return resolve(res);
        } catch (e) {
          return reject(e);
        }
      });
    };
  };

  return (
    <>
      {children}
      <ErrorModal
        isOpen={errorModalIsOpen}
        errorMessage={errorModalMessage}
        onRequestClose={() => setErrorModalIsOpen(false)}
      />
    </>
  );
};

export default Interceptor;
