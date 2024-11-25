import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../../schema";
import ErrorMessage from "../../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
}

const ForgetPass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
  });
  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost/truck_management/forgot_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        setMessage("Password reset link has been sent to your email.");
        setTimeout(() => navigate("/login"), 3000);
        console.log(responseData);
      } else {
        setMessage("Error sending password reset email. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[430px] h-auto bg-white p-6 rounded-lg">
        <div className="text-center mb-3">
          <div className="font-sans text-4xl font-bold">Forgot Password</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            placeholder="Enter your Email"
            type="email"
            name="email"
            register={register}
          />
          {errors.email?.message && <ErrorMessage text={String(errors.email.message)} />}

          {message && <p className={`text-sm ${message.includes("sent") ? "text-green-500" : "text-red-500"}`}>{message}</p>}

          <Button text={isLoading ? "Sending..." : "Send Reset Link"} type="submit" disabled={isLoading} />
        </form>
        </div>
      </div>
  );
};

export default ForgetPass;
