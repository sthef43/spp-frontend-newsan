import { TextField } from "@mui/material";
import { SEH_Auditoria } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria";
import React from "react";
import { Control, Controller, UseFormClearErrors, UseFormSetError } from "react-hook-form";
// import { PersonalInfo } from "./PersonalInfo";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { sehAuditoriaSliceRequest } from "app/features/seguridadEHigiene/auditoriasPersonal/reducers/SEH_AuditoriaSlice";
import { SP_SearchPersonal } from "app/features/seguridadEHigiene/auditoriasPersonal/services/SEH_Auditoria.services";
import { Close } from "@mui/icons-material";

interface Props {
  disabled?: boolean;
  reset?: () => void;
  control: Control<SEH_Auditoria, SEH_Auditoria>;
  setError?: UseFormSetError<SEH_Auditoria>;
  clearErrors?: UseFormClearErrors<SEH_Auditoria>;
  onPersonalSelected: (personal: SP_SearchPersonal) => void;
}

export const SearchPersonal = ({ disabled, reset, control, onPersonalSelected, setError, clearErrors }: Props) => {
  const dispatch = useAppDispatch();

  const handleSearch = async (data) => {
    const personal = unwrapResult(await dispatch(sehAuditoriaSliceRequest.SearchPersonal(data)));
    if (personal) {
      clearErrors("personalId");
      onPersonalSelected(personal || null);
    } else {
      setError("personalId", {
        type: "manual",
        message: "Operario no encontrado"
      });
    }
  };

  return (
    <>
      <Controller
        name="personalId"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <TextField
            variant="outlined"
            InputProps={{
              endAdornment: (
                <>
                  {disabled ? (
                    <Close
                      className="hover:cursor-pointer hover:shadow-emerald-300 text-red-600 rounded-full"
                      onClick={reset}
                    />
                  ) : null}
                </>
              )
            }}
            disabled={disabled}
            error={invalid}
            value={field.value}
            {...field}
            fullWidth
            className="w-full "
            style={{
              backgroundColor: "var(--background-color)"
            }}
            label="Buscar DNI"
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                handleSearch(field.value);
              }
            }}
            helperText={error?.message}
          />
        )}
      />
    </>
  );
};
