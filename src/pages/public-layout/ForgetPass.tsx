import './signin.css';
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../../schema";
import loginLogo from '../../assets/img/login_logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationService, ForgetPassRequest } from "../../swagger/api";
import { toast } from 'react-toastify';

interface FormValues {
  email: string;
}

const ForgetPass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
  });
  const onSubmit = async (data : ForgetPassRequest) => {
    setIsLoading(true);
    try {
      const response = await AuthenticationService.postForgotPassword(data);
      const responseData = await response;
      if (response.status === 'success') {
        toast.success(response.message);
        setTimeout(() => navigate("/login"), 3000);
        console.log(responseData);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-main-container d-flex justify-content-center align-items-center">
        <div className="login-container d-flex w-full justify-content-between bg-white">
          <div className="login-sub-container d-flex flex-column p-4 rounded-lg">
            <div className="text-center mb-3">
              <img src={loginLogo} alt="loginLogo" width="40" height="40"/>
              <div className="font-sans display-4 font-weight-bold">Forget Password</div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="login-form space-y-4 mt-2">
              <Input
                label="Email Address"
                type="text"
                name="email"
                register={register}
                error={errors.email}
              />
              <p className="mt-2 text-muted">
                <Link className="text-decoration-underline" to="/login">
                  Back to Login
                </Link>
              </p>
              <Button text={isLoading ? "Sending in..." : "Send"} type="submit" disabled={isLoading} />
            </form>
          </div>
          <div className="sub-div d-flex flex-column">
            <div className="login-logo d-flex justify-content-start w-full">
              <img src={loginLogo} alt="loginLogo" width="40" height="40" />
              <h4 className='head'>Search Portal</h4>
            </div>
            <div className="login-heading">
              <h1 className='header'>Welcome Back, Please enter email to send a link</h1>
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
  );
};

export default ForgetPass;
