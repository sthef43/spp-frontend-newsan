import { Divider, FormControl, FormHelperText, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { SerieLgSliceRequests } from "app/Middleware/reducers/SerieLgSlice";
import { TrazabilidadLgSliceRequests } from "app/Middleware/reducers/TrazabilidadLgSlice";
import { useAppDispatch } from "app/core/store/store";
import { VerificarNumLgTable } from "app/features/etiquetas/verificarNumerosLG/components/VerificarNumLgTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export const VerificarNumerosLGPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [codigos, setCodigos] = React.useState([]);
  const initialDefaultVar = {
    nroSrv: ""
  };
  const { control, getValues, handleSubmit, formState, reset } = useForm({ defaultValues: initialDefaultVar });
  const { errors, isDirty, isValid } = formState;
  const getByNroSrv = async () => {
    try {
      const resp = unwrapResult(await dispatch(SerieLgSliceRequests.getByNroSrv(getValues("nroSrv"))));
      if (resp) {
        const response = unwrapResult(await dispatch(TrazabilidadLgSliceRequests.getByNroSrv(getValues("nroSrv"))));
        response
          ? setCodigos([...codigos, { codigo: getValues("nroSrv"), estado: "2" }])
          : setCodigos([...codigos, { codigo: getValues("nroSrv"), estado: "3" }]);
      } else {
        setCodigos([...codigos, { codigo: getValues("nroSrv"), estado: "1" }]);
      }
      reset();
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  React.useEffect(() => {
    console.log(errors);
  }, []);

  React.useEffect(() => {
    TitleChanger("Verificar numeros de LG");
  }, []);

  return (
    <div className="my-2 mx-4">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew ">
        <div className="text-center text-xl">Escanee un número LG</div>
        <div className="mt-4">
          <form onSubmit={handleSubmit(getByNroSrv)}>
            <Controller
              name="nroSrv"
              control={control}
              rules={{
                minLength: 12,
                required: true,
                validate: (value) => value.toLocaleUpperCase().includes("RN", 3)
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="filled" error={!!error}>
                  <TextField {...field} autoFocus variant="outlined" />
                  {!!error && error.type == "minLength" && (
                    <FormHelperText>El mínimo de carácteres es 12</FormHelperText>
                  )}
                  {!!error && error.type == "validate" && (
                    <FormHelperText>El código no cumple con el formato</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </form>
        </div>
      </div>
      <Divider />
      {codigos.length != 0 && <VerificarNumLgTable codigos={codigos} />}
    </div>
  );
};
