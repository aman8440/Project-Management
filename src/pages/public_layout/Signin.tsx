import Input from "../../components/Input";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schema";
import { SignInData } from "../../interfaces";
import { Toaster, toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, setToken } from "../../services/storageService";

export default function Signin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/dashboard");
    } else {
      console.log("Token not found or invalid.");
    }
  }, [navigate]);

  const onSubmit = async (data: SignInData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost/truck_management/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData: {
        token: string;
        message?: string;
      } = await response.json();
  
      if (response.status === 200 && responseData?.token) {
        setToken(responseData.token);
        navigate("/dashboard");
      } else {
        console.error("Sign-in failed:", responseData);
        toast.error(responseData.message || "Incorrect credentials!");
      }
    } catch (error) {
      console.error("Error occurred during sign-in:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="w-100" style={{ maxWidth: '430px' }}>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-center mb-3">
              <div className="font-sans display-4 font-weight-bold">Login</div>
            </div>
            <Toaster richColors position="top-right" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="text"
                name="email"
                register={register}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                register={register}
                error={errors.password}
              />
              <p className="mt-2 text-muted">
                <Link className="text-decoration-underline" to="/forget">
                  Forgot Password?
                </Link>
              </p>
              <Button text={isLoading ? "Signing in..." : "Sign In"} type="submit" disabled={isLoading} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
