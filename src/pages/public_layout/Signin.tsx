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
import { useState } from "react";
import {  setAuthToken } from "../../services/storage.service";
import loginPage from '../../assets/img/login_page_image.jpg'
import loginLogo from '../../assets/img/login_logo.svg'

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
        setAuthToken(responseData.token);
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
      <div className="d-flex justify-content-center align-items-center" style={{width:'100%', height:'100vh'}}>
        <div className="d-flex w-full justify-content-between bg-white" style={{width:'100%', height:'100vh'}}>
          <div className="d-flex flex-column p-4 rounded-lg shadow" style={{width:'50%', alignItems:'center', justifyContent:'center'}}>
            <div className="text-center mb-3">
              <img src={loginLogo} alt="loginLogo" width="40" height="40"/>
              <div className="font-sans display-4 font-weight-bold">Login</div>
            </div>
            <Toaster richColors position="top-right" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2" style={{width:'50%'}}>
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
          <div className="d-flex" style={{width:'50%'}}>
            <img src={loginPage} alt="loginPage" style={{width:'100%'}}/>
          </div>
        </div>
      </div>
    </>
  );
}
