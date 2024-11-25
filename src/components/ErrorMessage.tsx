import React from "react";
import { ErrorMessageProps } from "../interfaces";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => {
  return (
    <span className="text-red-500 text-[12px]">{text}</span>
  );
};

export default ErrorMessage;