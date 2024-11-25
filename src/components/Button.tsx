import React from "react";
import { Button as MuiButton, } from "@mui/material";
import { ButtonProps } from "../interfaces/index";


const Button: React.FC<ButtonProps> = ({ text, type = "button", className, onClick, ...rest }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <MuiButton
        type={type}
        variant="contained"
        onClick={onClick} 
        className={`bg-dark text-white w-100 ${className}`}
        style={{ backgroundColor: "black", color: "white", width: "100%" }} 
        {...rest}
      >
        {text || ""}
      </MuiButton>
    </div>
  );
};

export default Button;