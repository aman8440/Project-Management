import Input from "../../components/Input";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schema";
import { SignInData } from "../../interfaces";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {  setAuthToken } from "../../services/storage.service";
import loginPage from '../../assets/img/login_page_image.jpg'
import loginLogo from '../../assets/img/login_logo.svg'
import React from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { constVariables } from "../../constants";

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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: SignInData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${constVariables.base_url}api/login`, {
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
        toast.success("Login successful!");
        navigate("/dashboard/projects");
      } else {
        // The interceptor will already handle toast for errors.
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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
            <form onSubmit={handleSubmit(onSubmit)} className="login-form space-y-4 mt-2" style={{width:'50%'}}>
              <Input
                label="Email Address"
                type="text"
                name="email"
                register={register}
                error={errors.email}
              />
              <Input
                label="Password"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                register={register}
                error={errors.password}
                inputSlotProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "hide the password" : "display the password"}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
