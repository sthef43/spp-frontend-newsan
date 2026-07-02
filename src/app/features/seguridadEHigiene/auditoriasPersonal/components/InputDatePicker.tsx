import React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { TextField } from "@mui/material";

interface props {
  setDate: (newDate) => void;
  label: string;
  defaultValue: Date;
  maxDate?: Date;
  minDate?: Date;
  error?: boolean;
  helperText?: string;
  variantStyle?: "standard" | "filled" | "outlined";
}

export const InputDatePicker = ({ setDate, label, maxDate, minDate, defaultValue, error, helperText, variantStyle }: props) => {
  const variantDefect = variantStyle ? variantStyle : "standard"
  return (
    <DesktopDatePicker
      label={label}
      value={defaultValue}
      maxDate={maxDate}
      minDate={minDate}
      inputFormat="DD/MM/YYYY"
      // onAccept={() => {
      //   setError(false);
      //   setInvalid(false);
      //   setErrorMsg("");
      // }}
      // onError={(e) => {
      //   setError(true);
      //   setInvalid(true);
      //   setErrorMsg("Fecha Invalida");
      // }}
      onChange={(e: any) => {
        const fechaFormateada = moment(e).format("MM-DD-YYYY");
        setDate(fechaFormateada);
      }}
      renderInput={(field) => (
        <TextField error={error} {...field} variant={variantDefect} fullWidth helperText={helperText} />
      )}
    />
  );
};
