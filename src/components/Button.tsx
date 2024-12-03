import React from "react";
import { Button as MuiButton, } from "@mui/material";
import { ButtonProps } from "../interfaces/index";


const Button: React.FC<ButtonProps> = ({ text, type = "button", className, onClick, startIconPass, ...rest }) => {
  return (
    <div className="d-flex justify-content-center align-items-center sidebar-btn">
      <MuiButton
        fullWidth={true}
        type={type}
        variant="contained"
        onClick={onClick} 
        className={`btn w-100 ${className}`}
        style={{ backgroundColor: "#0145FE", color: "#FFFFFF", width: "100%" }} 
        startIcon={startIconPass}
        {...rest}
      >
        {text || ""}
      </MuiButton>
    </div>
  );
};

export default Button;