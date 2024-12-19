import './signin.css';
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
import loginLogo from '../../assets/img/login_logo.svg';
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthEndpointsService, ResponseWrapper_Token_, UserLogin } from '../../swagger/api';

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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: UserLogin) => {
    setIsLoading(true);
    
    try {
      const response : ResponseWrapper_Token_ = await AuthEndpointsService.loginApiV1AuthLoginPost(data)
  
      if (response.data?.access_token) {
        setAuthToken(response.data.access_token);
        toast.success("Login successful!");
        navigate("/Extract");
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
      <div className="login-main-container d-flex justify-content-center align-items-center">
        <div className="login-container d-flex w-full justify-content-between bg-white">
          <div className="login-sub-container d-flex flex-column p-4 rounded-lg">
            <div className="text-center mb-3">
              <img src={loginLogo} alt="loginLogo" width="40" height="40"/>
              <div className="font-sans display-4 font-weight-bold">Login</div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="login-form space-y-4 mt-2">
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
              <Button text={isLoading ? "Logining in..." : "Login"} type="submit" disabled={isLoading} />
            </form>
          </div>
          <div className="sub-div d-flex flex-column">
            <div className="login-logo d-flex justify-content-start w-full">
              <img src={loginLogo} alt="loginLogo" width="40" height="40" />
              <h4 className='head'>Search Portal</h4>
            </div>
            <div className="login-heading">
              <h1 className='header'>Welcome Back, Please Login to Get started</h1>
            </div>
            <div className="login-para">
              <p className='para'>Maybe some text here will help me see it better. Oh God. Oke, let's do it then. </p>
            </div>
            <div className="login-image d-flex">
              <div className="login-sub-img"></div>
            </div>
          </div>
          <div className="right-content">
          </div>
        </div>
      </div>
    </>
  );
}
