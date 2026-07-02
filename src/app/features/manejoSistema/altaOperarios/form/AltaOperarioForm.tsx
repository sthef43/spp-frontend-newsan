import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { MQfunc } from "app/shared/components/material-ui/breakpoints";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Controller } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { IAppUser } from "app/models";

export const AltaOperarioForm = ({ refresh, setModalForm }: any) => {
  const { State: turnos } = useFetchApi(TurnoSliceRequests.getAllRequest);
  const { State: plantas } = useFetchApi(PlantSliceRequests.getAllRequest);
  const [showPassword, setShowPassword] = useState(false);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const schema = yup
    .object()
    .shape({
      username: yup.string().min(4).max(32).required("El nombre debe contener minimo 4 caracteres."),
      email: yup.string().email().required(),
      password: yup
        .string()
        .required("Ingrese una contraseña valida")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
          "Debe contener 8 caracteres, una minuscula, una mayuscula y un numero"
        ),
      dni: yup.number().required().positive().integer(),
      operator: yup.object().shape({
        name: yup.string().min(1).required(),
        surname: yup.string().min(1).required(),
        turnoId: yup.number().min(1).required().positive().integer(),
        position: yup.string().min(1).required(),
        plantaId: yup.number().min(1).required().positive().integer()
      }),
      permisosId: yup.number().default(1)
    })
    .required();

  const defaultState = {
    username: "",
    email: "",
    password: "",
    dni: 0,
    operator: {
      name: "",
      surname: "",
      turnoId: 1,
      position: "",
      plantaId: 4
    },
    permisosId: 1,
    validado: false //Cada vez que se crea un user, entra como no validado.
  };

  const defaultLabels = {
    username: "Nombre de usuario",
    email: "Email",
    dni: "Dni",
    operator: {
      name: "Nombre",
      surname: "Apellido",
      turnoId: "Turno",
      position: "Posicion",
      plantaId: "Planta"
    },
    permisosId: "hidden"
  };

  const selectFields = {
    Turno: {
      array: turnos,
      id: "id",
      column: "nombre"
    },
    Planta: {
      array: plantas,
      id: "id",
      column: "name"
    }
  };

  const { control, getValues, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultState,
    mode: "onChange"
  });

  const info = watch();

  const materialButtons = MaterialButtons();

  const guardar = async () => {
    const appUser: IAppUser = { ...info, validado: true };
    appUser.operator.dni = info.dni;
    const result = unwrapResult(await dispatch(AppUserSliceRequests.registerRequest(appUser)));
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setModalForm(false);
      refresh();
    } else {
      openNotificationUI("Hubo un problema. :(", "error");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
        <GenericFieldsGenerator
          values={defaultState}
          control={control}
          styleDiv={"my-2"}
          styleFieldSX={{ width: "100%", [MQfunc[1]]: { minWidth: "25rem" } }}
          selectFields={selectFields}
          labels={defaultLabels}
          variant="filled"
        />
        <div className="p-2 w-200">
          <Controller
            name={"password"}
            control={control}
            defaultValue={""}
            render={({ field, fieldState: { error } }) => (
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                value={getValues("password")}
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => {
                          setShowPassword(!showPassword);
                        }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="flex md:col-span-3 justify-around mt-4 w-full">
        <div>
          <Button
            variant="contained"
            className={materialButtons.greenButton}
            onClick={() => {
              guardar();
            }}
            disabled={!formState.isValid || !formState.isDirty}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};
