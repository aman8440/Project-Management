import { forwardRef } from "react";
import { TextField } from "@mui/material";
import { InputProps } from "../interfaces";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, register, name, value, error, className, inputSlotProps, multiline, rows, ...rest }, ref) => {
    return (
      <div className={`space-y-2 mb-4`}>
        <div>
          <TextField
            {...register?.(name) || ""}
            type={type || "text"}
            value={value}
            label={label}
            fullWidth={true}
            variant="outlined"
            placeholder={rest.placeholder}
            className={className || "InputBaseClass"}
            error={!!error?.message}
            helperText={error?.message}
            inputRef={ref}
            multiline={multiline}
            rows={rows}
            slotProps={{
              input: {
                ...inputSlotProps,
                style: {
                  height: '40px',
                  padding: '0 12px',
                  ...(inputSlotProps?.style || {}),
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
