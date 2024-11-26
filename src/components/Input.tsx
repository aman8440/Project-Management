import { forwardRef } from "react";
import { TextField } from "@mui/material";
import { InputProps } from "../interfaces";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, register, name, value, error, className, onChange, ...rest },ref) => {
    return (
      <div className={`space-y-2 mb-4`}>
        <div>
          <TextField
            {...register?.(name) || ""}
            type={type || "text"}
            value={value}
            onChange={onChange} 
            label={label}
            fullWidth={true}
            variant="outlined"
            placeholder={rest.placeholder}
            className={className || ""}
            error={!!error?.message}
            helperText={error?.message}
            inputRef={ref} 
            slotProps={{
              input: {
                style: {
                  height: '40px',
                  padding: '0 12px',
                },
              },
            }}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

export default Input;
