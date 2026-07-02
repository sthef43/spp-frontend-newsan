import { Box, FormControl, SxProps, TextField, Theme } from "@mui/material";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";

interface Props<T extends FieldValues> extends UseControllerProps<T> {
  placeholder?: string;
  label?: string;
  functionOnchange?: React.KeyboardEventHandler<HTMLDivElement>;
  variant?: "standard" | "outlined" | "filled";
  typeDate?: "number" | "password" | "text";
  stylesPersonalizaed?: SxProps<Theme>;
  iconInput?: React.ReactNode;
}

export const InputComponentForm = <T extends FieldValues>({
  name,
  control,
  rules,
  stylesPersonalizaed,
  placeholder,
  variant = "outlined",
  typeDate = "text",
  disabled = false,
  label,
  functionOnchange,
  iconInput
}: Props<T>) => {
  const {
    field,
    fieldState: { invalid },
    formState: { errors }
  } = useController({ name, control, rules });
  return (
    <FormControl fullWidth>
      <TextField
        {...field}
        onKeyDown={functionOnchange}
        autoComplete="off"
        disabled={disabled}
        sx={stylesPersonalizaed}
        label={label}
        placeholder={placeholder}
        variant={variant}
        type={typeDate}
        error={invalid}
        helperText={errors[name]?.message as string}
        fullWidth
        InputProps={{ startAdornment: iconInput }}
      />
    </FormControl>
  );
};
