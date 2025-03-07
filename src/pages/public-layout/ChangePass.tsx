import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schema";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { useParams, useNavigate } from "react-router-dom";
import { FormValues } from "../../interfaces";
import { AuthenticationService, ResetPassResponse, TokenResetResponse } from "../../swagger/api";

const ChangePass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const { reset_token } = useParams<{ reset_token: string }>();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const validateToken = async () => {
      setIsLoading(true);
      try {
        const response : TokenResetResponse = await AuthenticationService.getVerifyToken(reset_token ?? '');
        if (response) {
          if (response.status === "success") {
            setIsTokenValid(true);
          } else {
            setErrorMessage("Invalid or expired token. Please request a new password reset.");
            setIsTokenValid(false);
          }
        }
      } catch (error) {
        setErrorMessage("An error occurred while validating the token. Please try again later.");
        console.log(error);
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [reset_token]);

  const onSubmit = async (data : FormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const request : FormValues = { ...data };
      delete (request as { confirmPassword?: string })["confirmPassword"];
      const response : ResetPassResponse = await AuthenticationService.postResetPassword(request)

      if (response.status === "success") {
        setSuccessMessage("Your password has been reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const responseData = await response;
        setErrorMessage(responseData.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isTokenValid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">
          {errorMessage || "Invalid or expired link."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[430px] h-auto bg-white p-6 rounded-lg">
        <div className="text-center mb-3">
          <div className="font-sans text-4xl font-bold">Reset Password</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            placeholder="Enter your new password"
            type="password"
            name="password"
            register={register}
          />
          {errors.password && <ErrorMessage text={String(errors.password.message)} />}

          <Input
            label="Confirm Password"
            placeholder="Confirm your new password"
            type="password"
            name="confirmPassword"
            register={register}
          />
          {errors.confirmPassword && <ErrorMessage text={String(errors.confirmPassword.message)} />}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <Button text={isLoading ? "Resetting..." : "Reset Password"} type="submit" disabled={isLoading}/>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;
